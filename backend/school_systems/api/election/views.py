from rest_framework import viewsets, serializers, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..permissions.permissions import CanManageElection, CanVote

from election.models import Election, Position, Candidate, Partylist, Vote, YearLevelValidItem, CourseValidItem, PartylistElection
from school.models import SchoolYearStudentInfo

from .serializers.create import CandidateCreateSerializer, PartylistCreateSerializer, ElectionCreateSerializer, PositionCreateSerializer, VoteCreateSerializer, CourseValidItemCreateSerializer, YearLevelValidItemCreateSerializer, PartylistElection

from .serializers.detail import VoteDetailSerializer,  PositionDetailSerializer, ElectionDetailSerializer, PartylistDetailSerializer, CandidateDetailSerializer

from .serializers.list import VoteListSerializer, PositionListSerializer, ElectionListSerializer, PartylistListSerializer, CandidateListSerializer

from .services.vote_cast import cast_vote

class CandidateViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageElection()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            queryset = Candidate.objects.all()
        elif hasattr(user, 'facilitator'):
            queryset = Candidate.objects.filter(
                election__school=user.facilitator.school
            )
        
        elif hasattr(user, 'student'):
            queryset = Candidate.objects.filter(
                school=user.student.school
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
    
    def perform_create(self, serializer):
        facilitator = self.request.user.facilitator
        school = facilitator.school
        validated = serializer.validated_data
        student = validated['student']
        election = validated['election']

        if school != election.school:
            raise serializers.ValidationError('Using wrong data')

        year_level = student.year_level
        course = student.course

        serializer.save(
            facilitator=facilitator,
            year_level=year_level,
            course=course,
        )


class PosistionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            queryset = Position.objects.all()
        elif hasattr(user, 'facilitator'):
            queryset = Position.objects.filter(
                election__school=user.facilitator.school
            )
        else: 
            return Position.objects.none()
        
        election = self.request.query_params.get('election')

        if election:
            queryset = queryset.filter(
                election=election
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PositionDetailSerializer
        elif self.action == 'create':
            return PositionCreateSerializer
        elif self.action == 'list':
            return PositionListSerializer
        return PositionListSerializer
    
    def perform_create(self, serializer):
        facilitator = self.request.user.facilitator
        school = facilitator.school

        election = serializer.validated_data['election']

        if school != election.school:
            raise serializers.ValidationError('Using wrong data')
        
        serializer.save(
            added_by=facilitator
        )


class PartylistViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Partylist.objects.all()
        elif hasattr(user, 'facilitator'):
            return Partylist.objects.filter(
                election__school=user.facilitator.school
            )
        
        elif hasattr(user, 'student'):
            return Partylist.objects.filter(
                school=user.student.school
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
    
    def perform_create(self, serializer):
        
        return super().perform_create(serializer)
    
class ElectionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Election.objects.all()
        elif hasattr(user, 'facilitator'):
            return Election.objects.filter(
                school=user.facilitator.school
            )
        
        elif hasattr(user, 'student'):
            return Election.objects.filter(
                school=user.student.school
            )

        return Election.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ElectionDetailSerializer
        elif self.action == 'create':
            return ElectionCreateSerializer
        elif self.action == 'list':
            return ElectionListSerializer

        return ElectionListSerializer
    
    def perform_create(self, serializer):
        facilitator = self.request.user.facilitator
        
        serializers.save(
            added_by=facilitator
        )

    
class VoteViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]
        
        return [IsAuthenticated(), CanVote()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Vote.objects.all()
        elif hasattr(user, 'facilitator'):
            return Vote.objects.filter(
                election__school_year__school=user.facilitator.school
            )
        elif hasattr(user, 'student'):
            return Vote.objects.filter(
                election__school_year__school=user.student.school
            )

        return Vote.objects.none()
        
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VoteDetailSerializer
        elif self.action == 'create':
            return VoteCreateSerializer
        elif self.action == 'list':
            return VoteListSerializer

        return VoteListSerializer
    
    def create(self, request, *args, **kwargs):

        serializer = VoteCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        student = user.student

        election_id = serializer.validated_data['election']
        election = Election.objects.get(id=election_id)

        student_info = SchoolYearStudentInfo.objects.get(student=student,school_year=election.school_year)

        vote = cast_vote(student_info=student_info,election_id=election_id,vote_items_data=serializer.validated_data['vote_items'])

        return Response({'vote_id':vote.id},status=status.HTTP_201_CREATED)

class CourseLevelValidItemViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if hasattr(user, 'facilitator'):
            queryset = CourseValidItem.objects.filter(
                election__school=user.facilitator.school
            )
        else: 
            return CourseValidItem.objects.none()
        
        election = self.request.query_params.get('election')

        if election:
            queryset = queryset.filter(
                election=election
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseValidItemCreateSerializer
        return 
    
    def perform_create(self, serializer):
        facilitator = self.request.user.facilitator
        school = facilitator.school

        election = serializer.validated_data['election']

        if school != election.school:
            raise serializers.ValidationError('Using wrong data')
        
        serializer.save(
            added_by=facilitator
        )

class YearLevelValidItemCreateViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if hasattr(user, 'facilitator'):
            queryset = YearLevelValidItem.objects.filter(
                election__school=user.facilitator.school
            )
        else: 
            return YearLevelValidItem.objects.none()
        
        election = self.request.query_params.get('election')

        if election:
            queryset = queryset.filter(
                election=election
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return YearLevelValidItemCreateSerializer
        return 
    
    def perform_create(self, serializer):
        facilitator = self.request.user.facilitator
        school = facilitator.school

        election = serializer.validated_data['election']

        if school != election.school:
            raise serializers.ValidationError('Using wrong data')
        
        serializer.save(
            added_by=facilitator
        )

class PartylistElectionItemCreateViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user

        if hasattr(user, 'facilitator'):
            queryset = PartylistElection.objects.filter(
                election__school=user.facilitator.school
            )
        else: 
            return PartylistElection.objects.none()
        
        election = self.request.query_params.get('election')

        if election:
            queryset = queryset.filter(
                election=election
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return PartylistElectionItemCreateViewSet
        return 
    
    def perform_create(self, serializer):
        facilitator = self.request.user.facilitator
        
        serializer.save(
            added_by=facilitator
        )