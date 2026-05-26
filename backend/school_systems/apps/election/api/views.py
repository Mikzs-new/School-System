from rest_framework import viewsets,status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.serializers import ValidationError
from rest_framework.decorators import action

from shared.permissions.user_permissions import CanManageElection, CanVote

from apps.election.models.election import Election, ElectionStatus
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import PartylistElection, ElectionEligiblePosition, ElectionEligibleCourse, ElectionEligibleYearLevel
from apps.election.models.partylist import Partylist
from apps.election.models.vote import Vote

from .serializers.create import CandidateCreateSerializer, PartylistCreateSerializer, ElectionCreateSerializer, ElectionEligiblePositionCreateSerializer, VoteCreateSerializer, PartylistElection, ElectionEligibleCourseCreateSerializer, ElectionEligibleYearLevelCreateSerializer, PartylistElectionCreateSerializer
from .serializers.detail import ElectionDetailSerializer, PartylistDetailSerializer, CandidateDetailSerializer, ElectionResultSerializer
from .serializers.list import ElectionListSerializer, PartylistListSerializer, CandidateListSerializer
from .serializers.update import ElectionUpdateSerializer

from apps.election.services.vote_services import VoteService
from apps.election.services.election_services import ElectionService
from apps.election.services.candidate_services import CandidateService
from apps.election.services.partylist_services import PartylistService

from apps.election.selectors.election_selectors import ElectionSelector

class CandidateViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageElection()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            queryset = Candidate.objects.all()
        elif hasattr(user, 'school_staff_profile'):
            queryset = Candidate.objects.filter(
                election__school_year__school=user.school_staff_profile.school
            )
        
        elif hasattr(user, 'student_profile'):
            queryset = Candidate.objects.filter(
                election__school_year__school=user.student_profile.school
            )
        else: 
            return Candidate.objects.none()
        
        election = self.request.query_params.get('election')

        if election:
            queryset = queryset.filter(
                election=election
            )

        return queryset

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

        school_staff_profile = request.user.school_staff_profile

        candidate = CandidateService.create_candidate(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Candidate created', 'id': candidate.id}, status=status.HTTP_201_CREATED)


class ElectionEligiblePositionViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = [IsAuthenticated, CanManageElection]
    
    serializer_class = ElectionEligiblePositionCreateSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            queryset = ElectionEligiblePosition.objects.all()
        elif hasattr(user, 'school_staff_profile'):
            queryset = ElectionEligiblePosition.objects.filter(
                election__school_year__school=user.school_staff_profile.school
            )
        
        elif hasattr(user, 'student_profile'):
            queryset = ElectionEligiblePosition.objects.filter(
                election__school_year__school=user.student_profile.school
            )
        else: 
            return ElectionEligiblePosition.objects.none()
        
        election = self.request.query_params.get('election')

        if election:
            queryset = queryset.filter(
                election=election
            )

        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can create position")

        school_staff_profile = request.user.school_staff_profile

        position = ElectionService.create_position(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Position created', 'id': position.id}, status=status.HTTP_201_CREATED)

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

        election_snapshot = ElectionService.generate_snapshot(schooL_staff_profile=user.school_staff_profile,election=election)

        return Response({"message": "Election ended and records saved successfully", "id": election_snapshot.id},status=status.HTTP_202_ACCEPTED)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        election = self.get_object()

        if election.status != ElectionStatus.ENDED:
            raise ValidationError('Election results are not avaliable yet')
        
        serializer = ElectionResultSerializer(election)

        return Response(serializer.data)

class ElectionEligibleCourseViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = [IsAuthenticated, CanManageElection]

    serializer_class = ElectionEligibleCourseCreateSerializer

    queryset = ElectionEligibleCourse.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can add eligible courses")

        school_staff_profile = request.user.school_staff_profile

        eligible_course = ElectionService.create_eligible_course(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Eligible course created', 'id': eligible_course.id}, status=status.HTTP_201_CREATED)
    
class ElectionEligibleYearLevelViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = [IsAuthenticated, CanManageElection]

    serializer_class = ElectionEligibleYearLevelCreateSerializer

    queryset = ElectionEligibleYearLevel.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can add eligible year level")

        school_staff_profile = request.user.school_staff_profile

        eligible_year_level = ElectionService.create_eligible_year_level(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Eligible year level created', 'id': eligible_year_level.id}, status=status.HTTP_201_CREATED)

class PartylistElectionViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = [IsAuthenticated, CanManageElection]

    serializer_class = PartylistElectionCreateSerializer

    queryset = PartylistElection.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not hasattr(request.user, 'school_staff_profile'):
            raise ValidationError("Only staff can add eligible election partylist")

        school_staff_profile = request.user.school_staff_profile

        eligible_partylist = ElectionService.create_eligible_partylist(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Eligible partylist created', 'id': eligible_partylist.id}, status=status.HTTP_201_CREATED)

class VoteViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    queryset = Vote.objects.all()

    permission_classes = [IsAuthenticated, CanVote]

    serializer_class = VoteCreateSerializer

    def create(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        vote = VoteService.cast_vote(
            student_profile=request.user.student_profile, 
            **serializer.validated_data
        )

        return Response({'message': 'vote_submitted', 'vote':vote.id},status=status.HTTP_201_CREATED)
