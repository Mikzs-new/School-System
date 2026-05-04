from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .permissions import IsFacilitator, IsStudent

from candidates.models import Candidate, Partylist
from elections.models import Election, Position, CourseValidItem, YearLevelValidItem
from facilitators.models import Facilitator
from registrations.models import Registration
from schools.models import School
from students.models import Student, Course, Department
from votes.models import Vote, VoteItem

from .serializer import CandidateSerializer, CandidateCreateSerializer, PartylistSerializer, PartylistCreateSerializer, ElectionSerializer, ElectionCreateSerializer, PositionSerializer, PositionCreateSerializer, CourseValidItemSerializer, CourseValidItemCreateSerializer, YearLevelValidItemSerializer, YearLevelValidItemCreateSerializer, FacilitatorSerializer, FacilitatorCreateSerializer, SchoolSerializer, SchoolCreateSerializer, StudentSerializer, StudentCreateSerializer, CourseSerializer, CourseCreateSerializer, VoteSerializer, VoteCreateSerializer, RegistrationCreateSerializer, RegistrationSerializer, DepartmentSerializer, DepartmentCreateSerializer

from .validation import validate_csv, validate_image

# API version 1

# Direct Endpoint

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CandidateCreateSerializer
        return CandidateSerializer

class PartylistViewSet(viewsets.ModelViewSet):
    queryset = Partylist.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PartylistCreateSerializer
        return PartylistSerializer
    
class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ElectionCreateSerializer
        return ElectionSerializer

class FacilitatorViewSet(viewsets.ModelViewSet):
    queryset = Facilitator.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FacilitatorCreateSerializer
        return FacilitatorSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DepartmentCreateSerializer
        return DepartmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateSerializer
        return CourseSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RegistrationCreateSerializer
        return RegistrationSerializer

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SchoolCreateSerializer
        return SchoolSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        student = self.request.query_params.get('student')

        if student:
            queryset = queryset.filter(student=student)
        
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentSerializer

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    permission_classes = [IsAuthenticated, IsFacilitator]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VoteCreateSerializer
        return VoteSerializer
    
# Bulk POST endpoint
