from rest_framework import viewsets,status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.serializers import ValidationError
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404

from shared.permissions.user_permissions import CanManageElection, CanVote

from apps.election.models.election import Election, ElectionStatus
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import PartylistElection, ElectionEligiblePosition, ElectionEligibleCourse, ElectionEligibleYearLevel
from apps.election.models.partylist import Partylist
from apps.election.models.vote import Vote

from apps.student.models import StudentEnrollment

from .serializers.create import CandidateCreateSerializer, PartylistCreateSerializer, ElectionCreateSerializer, ElectionEligiblePositionCreateSerializer, VoteCreateSerializer, PartylistElection, ElectionEligibleCourseCreateSerializer, ElectionEligibleYearLevelCreateSerializer, PartylistElectionCreateSerializer
from .serializers.detail import ElectionDetailSerializer, PartylistDetailSerializer, CandidateDetailSerializer, ElectionResultSerializer
from .serializers.list import ElectionListSerializer, PartylistListSerializer, CandidateListSerializer, ElectionEligibleCourseListSerializer, ElectionEligiblePositionListSerializer, ElectionEligibleYearLevelListSerializer, PartylistElectionListSerializer, VoteListSerializer, EligibleStudentsListSerializer, VotingCandidatesListSerializer
from .serializers.update import ElectionUpdateSerializer, ElectionUpdateTimeSerializer

from apps.election.services.vote_services import VoteService
from apps.election.services.election_services import ElectionService
from apps.election.services.candidate_services import CandidateService
from apps.election.services.partylist_services import PartylistService

from apps.election.selectors.election_selectors import ElectionSelector

class PartylistViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Partylist.objects.all()
        elif hasattr(user, 'school_staff_profile'):
            return Partylist.objects.filter(
                school=user.school_staff_profile.school
            )
        
        elif hasattr(user, 'student_profile'):
            return Partylist.objects.filter(
                school=user.student_profile.school
            )

        return Partylist.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PartylistDetailSerializer
        elif self.action == 'create':
            return PartylistCreateSerializer
        elif self.action == 'list':
            return PartylistListSerializer

        return PartylistListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can create partylist")

        school_staff_profile = request.user.school_staff_profile

        partylist = PartylistService.create_partylist(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Partylist created', 'id': partylist.id}, status=status.HTTP_201_CREATED)
    
class ElectionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanManageElection()]

        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user

        return ElectionSelector.get_queryset(user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ElectionDetailSerializer
        elif self.action in ['update','partial_update']:
            return ElectionUpdateSerializer
        elif self.action == 'create':
            return ElectionCreateSerializer
        elif self.action == 'list':
            return ElectionListSerializer

        return ElectionListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can create elections")

        school_staff_profile = request.user.school_staff_profile

        election = ElectionService.create_election(
            school_staff_profile=school_staff_profile,
            validated_data=serializer.validated_data
        )

        return Response({'message':'Election created', 'id': election.id}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_time(self, request, pk=None):
        election = self.get_object()

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError(
                'Only staff can update election time'
            )

        if election.status != ElectionStatus.DRAFTED:
            raise ValidationError('Cannot make changes in election')

        serializer = ElectionUpdateTimeSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        ElectionService.update_time(
            election=election,
            start_datetime=serializer.validated_data['start_datetime'],
            end_datetime=serializer.validated_data['end_datetime']
        )

        return Response(
            {'message': 'Election schedule updated successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def end_election(self, request, pk=None):
        election = self.get_object()

        if election.status == ElectionStatus.DRAFTED:
            raise ValidationError('Election has not started yet')
    
        if election.status == ElectionStatus.ENDED:
            raise ValidationError("Election already ended")

        user = request.user

        if not hasattr(user, 'school_staff_profile'):
            raise ValidationError('User has no permission')

        election_snapshot = ElectionService.generate_snapshot(school_staff_profile=user.school_staff_profile,election=election)

        return Response({"message": "Election ended and records saved successfully", "id": election_snapshot.id}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def start_election(self, request, pk=None):
        election = self.get_object()

        if election.status != ElectionStatus.DRAFTED:
            raise ValidationError('Election current status is not drafted')
        
        user = request.user

        election.status = ElectionStatus.ACTIVE
        election.save(update_fields=['status'])
        
        # Also update any related records
        Election.objects.filter(id=election.id).update(status=ElectionStatus.ACTIVE)

        return Response({'message': 'Election started successfully'}, status=status.HTTP_200_OK)


    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        election = self.get_object()

        if election.status != ElectionStatus.ENDED:
            raise ValidationError('Election results are not available yet')
        
        try:
            snapshot = ElectionAnalyticsSnapshot.objects.get(election=election)
            serializer = ElectionResultSerializer(snapshot)
            return Response(serializer.data)
        except ElectionAnalyticsSnapshot.DoesNotExist:
            raise ValidationError('Election results have not been generated yet')

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):

        if not hasattr(self.request.user, 'school_staff_profile'):
            raise ValidationError('No permission to access')

        election = self.get_object()

        year_levels = ElectionEligibleYearLevel.objects.filter(election=election).values_list('year_level', flat=True)
        courses = ElectionEligibleCourse.objects.filter(election=election).values_list('course', flat=True)

        students = StudentEnrollment.objects.select_related(
            'student',
            'course'
        ).filter(
            school_year=election.school_year,
            year_level__in=year_levels,
            course__in=courses
        )

        serializer = EligibleStudentsListSerializer(students,many=True)

        return Response(serializer.data)

class ElectionEligibleCourseViewSet(viewsets.GenericViewSet, 
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    mixins.DestroyModelMixin):
    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanManageElection()]

    def get_election(self):
        user = self.request.user

        qs = ElectionSelector.get_queryset(user)

        return get_object_or_404(
            qs,
            pk=self.kwargs['election_pk']
        )

    def get_queryset(self):
        election = self.get_election()

        return ElectionEligibleCourse.objects.filter(election=election).select_related('course')

    def get_serializer_class(self):
        if self.action == 'create':
            return ElectionEligibleCourseCreateSerializer
        if self.action == 'list':
            return ElectionEligibleCourseListSerializer
        return ElectionEligibleCourseListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can add eligible courses")

        election = self.get_election()

        school_staff_profile = request.user.school_staff_profile

        eligible_course = ElectionService.create_eligible_course(
            school_staff_profile=school_staff_profile,
            election=election,
            **serializer.validated_data
        )

        return Response({'message':'Eligible course created', 'id': eligible_course.id}, status=status.HTTP_201_CREATED)
    
class ElectionEligiblePositionViewSet(viewsets.GenericViewSet, 
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    mixins.DestroyModelMixin):
    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanManageElection()]

    def get_election(self):
        user = self.request.user

        qs = ElectionSelector.get_queryset(user)

        return get_object_or_404(
            qs,
            pk=self.kwargs['election_pk']
        )

    def get_queryset(self):
        election = self.get_election()

        return ElectionEligiblePosition.objects.filter(election=election)

    def get_serializer_class(self):
        if self.action == 'create':
            return ElectionEligiblePositionCreateSerializer
        if self.action == 'list':
            return ElectionEligiblePositionListSerializer
        return ElectionEligiblePositionListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can create position")

        election = self.get_election()

        school_staff_profile = request.user.school_staff_profile

        position = ElectionService.create_position(
            school_staff_profile=school_staff_profile,
            election=election,
            **serializer.validated_data
        )

        return Response({'message':'Position created', 'id': position.id}, status=status.HTTP_201_CREATED)

class ElectionEligibleYearLevelViewSet(viewsets.GenericViewSet, 
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    mixins.DestroyModelMixin):
    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanManageElection()]

    def get_election(self):
        user = self.request.user

        qs = ElectionSelector.get_queryset(user)

        return get_object_or_404(
            qs,
            pk=self.kwargs['election_pk']
        )

    def get_queryset(self):
        election = self.get_election()

        return ElectionEligibleYearLevel.objects.filter(election=election)

    def get_serializer_class(self):
        if self.action == 'create':
            return ElectionEligibleYearLevelCreateSerializer
        if self.action == 'list':
            return ElectionEligibleYearLevelListSerializer
        return ElectionEligibleYearLevelListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can create position")

        election = self.get_election()

        school_staff_profile = request.user.school_staff_profile

        position = ElectionService.create_position(
            school_staff_profile=school_staff_profile,
            election=election
            **serializer.validated_data
        )

        return Response({'message':'Position created', 'id': position.id}, status=status.HTTP_201_CREATED)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can add eligible year level")
        
        election = self.get_election()

        school_staff_profile = request.user.school_staff_profile

        eligible_year_level = ElectionService.create_eligible_year_level(
            school_staff_profile=school_staff_profile,
            election=election,
            **serializer.validated_data
        )

        return Response({'message':'Eligible year level created', 'id': eligible_year_level.id}, status=status.HTTP_201_CREATED)
    
class PartylistElectionViewSet(viewsets.GenericViewSet, 
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    mixins.DestroyModelMixin):
    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanManageElection()]

    def get_election(self):
        user = self.request.user

        qs = ElectionSelector.get_queryset(user)

        return get_object_or_404(
            qs,
            pk=self.kwargs['election_pk']
        )

    def get_queryset(self):
        election = self.get_election()

        return PartylistElection.objects.filter(election=election)

    def get_serializer_class(self):
        if self.action == 'create':
            return PartylistElectionCreateSerializer
        if self.action == 'list':
            return PartylistElectionListSerializer
        return PartylistElectionListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can add eligible election partylist")

        election = self.get_election()

        school_staff_profile = request.user.school_staff_profile

        eligible_partylist = ElectionService.create_eligible_partylist(
            school_staff_profile=school_staff_profile,
            election=election,
            **serializer.validated_data
        )

        return Response({'message':'Eligible partylist created', 'id': eligible_partylist.id}, status=status.HTTP_201_CREATED)

class VoteViewSet(viewsets.GenericViewSet, 
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin):
    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanVote()]

    def get_election(self):
        user = self.request.user

        qs = ElectionSelector.get_queryset(user)

        return get_object_or_404(
            qs,
            pk=self.kwargs['election_pk']
        )

    def get_queryset(self):
        election = self.get_election()

        return Vote.objects.filter(election=election)

    def get_serializer_class(self):
        user = self.request.user
        if self.action == 'create':
            return VoteCreateSerializer
        elif self.action == 'list':
            return VotingCandidatesListSerializer
        return VotingCandidatesListSerializer
    
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = self.request.user

        if not hasattr(user, 'student_profile'):
            raise ValidationError('Only students can vote')
        
        election = self.get_election()

        vote = VoteService.cast_vote(
            student_profile=request.user.student_profile, 
            election=election,
            **serializer.validated_data
        )

        return Response({'message': 'vote submitted', 'vote':vote.id},status=status.HTTP_201_CREATED)
    def list(self, request, *args, **kwargs):
        election = self.get_election()
        positions = ElectionEligiblePosition.objects.filter(election=election)
        serializer = VotingCandidatesListSerializer(positions,many=True)
        return Response(serializer.data)

class CandidateViewSet(viewsets.GenericViewSet, 
                                    mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    mixins.DestroyModelMixin):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def get_permissions(self):
        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageElection()]

    def get_election(self):
        user = self.request.user

        qs = ElectionSelector.get_queryset(user)

        return get_object_or_404(
            qs,
            pk=self.kwargs['election_pk']
        )

    def get_queryset(self):
        election = self.get_election()

        return Candidate.objects.filter(election=election)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CandidateDetailSerializer
        elif self.action == 'create':
            return CandidateCreateSerializer
        elif self.action == 'list':
            return CandidateListSerializer
        return CandidateListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can create candidate")
        
        election = self.get_election()

        school_staff_profile = request.user.school_staff_profile

        candidate = CandidateService.create_candidate(
            school_staff_profile=school_staff_profile,
            election=election,
            **serializer.validated_data
        )

        return Response({'message':'Candidate created', 'id': candidate.id}, status=status.HTTP_201_CREATED)    

   