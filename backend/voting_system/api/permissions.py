from rest_framework.permissions import BasePermission


class IsFacilitator(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'facilitator')

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'student')