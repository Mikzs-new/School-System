from rest_framework import viewsets, serializers, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from shared.permissions.user_permissions import CanManageElection, CanVote

from apps.election.models.election import Election
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import PartylistElection, ElectionEligiblePosition
from apps.election.models.partylist import Partylist
from apps.election.models.vote import Vote

from apps.student.models.student_enrollment import StudentEnrollment

from .serializers.create import CandidateCreateSerializer, PartylistCreateSerializer, ElectionCreateSerializer, ElectionEligiblePositionCreateSerializer, VoteCreateSerializer, PartylistElection

from .serializers.detail import VoteDetailSerializer,  ElectionEligiblePositionDetailSerializer, ElectionDetailSerializer, PartylistDetailSerializer, CandidateDetailSerializer

from .serializers.list import VoteListSerializer, ElectionEligiblePositionListSerializer, ElectionListSerializer, PartylistListSerializer, CandidateListSerializer

from apps.election.services.vote_services import VoteService

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
        return


class ElectionEligiblePositionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageElection()]
    
    def get_queryset(self):
        user = self.request.user
        return 

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ElectionEligiblePositionDetailSerializer
        elif self.action == 'create':
            return ElectionEligiblePositionCreateSerializer
        elif self.action == 'list':
            return ElectionEligiblePositionListSerializer
        return ElectionEligiblePositionListSerializer
    
    def perform_create(self, serializer):
        return


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

    
class VoteViewSet(viewsets.GenericViewSet):
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
