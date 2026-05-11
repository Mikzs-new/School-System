from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..permissions.permissions import IsAdmin, CanManageModel, CanVote

from election.models import Election, Position, Candidate, Partylist, Vote

from .serializers.create import CandidateCreateSerializer, PartylistCreateSerializer, ElectionCreateSerializer, PositionCreateSerializer, VoteCreateSerializer 

from .serializers.detail import VoteDetailSerializer,  PositionDetailSerializer, ElectionDetailSerializer, PartylistDetailSerializer, CandidateDetailSerializer

from .serializers.list import VoteListSerializer, PositionListSerializer, ElectionListSerializer, PartylistListSerializer, CandidateListSerializer

class CandidateViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageModel()]

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

class PosistionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]
    
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

class PartylistViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageModel()]
    
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
    
class ElectionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):

        if self.action in ['list','retrieve']:
            return [IsAuthenticated()]

        return [IsAuthenticated(), CanManageModel()]
    
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
                election__school=user.facilitator.school
            )
        elif hasattr(user, 'student'):
            return Vote.objects.filter(
                election__school=user.student.school
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