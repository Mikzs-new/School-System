from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .permissions import IsAdmin, CanManageModel, CanVote

from election.models import Election, Position, CourseValidItem, YearLevelValidItem, Candidate, Partylist, Vote, VoteItem
from school.models import Registration, School, Facilitator, Student, Course, Department

from .serializers.election import CandidateSerializer, CandidateCreateSerializer, PartylistSerializer, PartylistCreateSerializer, ElectionSerializer, ElectionCreateSerializer, PositionSerializer, PositionCreateSerializer, CourseValidItemSerializer, CourseValidItemCreateSerializer, YearLevelValidItemSerializer, YearLevelValidItemCreateSerializer, VoteSerializer, VoteCreateSerializer 
from .serializers.school import FacilitatorSerializer, FacilitatorCreateSerializer, SchoolSerializer, SchoolCreateSerializer, StudentSerializer, StudentCreateSerializer, CourseSerializer, CourseCreateSerializer, RegistrationCreateSerializer, RegistrationSerializer, DepartmentSerializer, DepartmentCreateSerializer

from .validation import validate_csv, validate_image

# API version 1

# Direct Endpoint

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
        return CandidateSerializer

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
        return PartylistSerializer
    
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
        return ElectionSerializer

class FacilitatorViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Facilitator.objects.all()
        elif hasattr(user, 'facilitator'):
            return Facilitator.objects.filter(
                school=user.facilitator.school
            )
        
        return Facilitator.objects.none()

    
    def get_serializer_class(self):
        if self.action == 'create':
            return FacilitatorCreateSerializer
        return FacilitatorSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Department.objects.all()
        elif hasattr(user, 'facilitator'):
            return Department.objects.filter(
                school=user.facilitator.school
            )
        
        return Department.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return DepartmentCreateSerializer
        return DepartmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Course.objects.all()
        elif hasattr(user, 'facilitator'):
            return Course.objects.filter(
                school=user.facilitator.school
            )
        
        return Course.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseCreateSerializer
        return CourseSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdmin()]
    
    def get_queryset(self):
        return Registration.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RegistrationCreateSerializer
        return RegistrationSerializer

class SchoolViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdmin()]
    
    def get_queryset(self):
        return School.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return SchoolCreateSerializer
        return SchoolSerializer

class StudentViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Student.objects.all()
        elif hasattr(user, 'facilitator'):
            return Student.objects.filter(
                school=user.facilitator.school
            )
        
        return Student.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        return StudentSerializer

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
        return VoteSerializer
    
# Bulk POST endpoint
