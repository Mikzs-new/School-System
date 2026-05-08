from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..permissions import IsAdmin, CanManageModel, CanVote

from election.models import Election, Position, CourseValidItem, YearLevelValidItem, Candidate, Partylist, Vote, VoteItem

from ..serializers.election import CandidateDetailSerializer, CandidateCreateSerializer, PartylistDetailSerializer, PartylistCreateSerializer, ElectionDetailSerializer, ElectionCreateSerializer, PositionDetailSerializer, PositionCreateSerializer, CourseValidItemDetailSerializer, CourseValidItemCreateSerializer, YearLevelValidItemDetailSerializer, YearLevelValidItemCreateSerializer, VoteDetailSerializer, VoteCreateSerializer 

from ..validation import validate_csv, validate_image

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
        if self.action == 'create':
            return CandidateCreateSerializer
        return CandidateDetailSerializer

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
        if self.action == 'create':
            return PositionCreateSerializer
        return PositionDetailSerializer

class YearLevelItemViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            queryset = YearLevelValidItem.objects.all()
        elif hasattr(user, 'facilitator'):
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
        return YearLevelValidItemDetailSerializer
    
class CourseValidItemViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            queryset = CourseValidItem.objects.all()
        elif hasattr(user, 'facilitator'):
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
            return  CourseValidItemCreateSerializer
        return CourseValidItemDetailSerializer

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
        if self.action == 'create':
            return PartylistCreateSerializer
        return PartylistDetailSerializer
    
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
        if self.action == 'create':
            return ElectionCreateSerializer
        return ElectionDetailSerializer
    
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
        if self.action == 'create':
            return VoteCreateSerializer
        return VoteDetailSerializer