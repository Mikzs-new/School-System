from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff

class CanManageModel(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        return (
            user.groups.filter(name='Facilitator').exists()
            or
            user.is_staff
        )

class CanManageElection(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        return user.groups.filter(name='Facilitator').exists()

class CanVote(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Student').exists()
    