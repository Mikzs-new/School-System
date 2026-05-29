from django.urls import path, include

from . import views as election

from rest_framework_nested import routers

router = routers.DefaultRouter()
router.register(r'elections', election.ElectionViewSet, basename='elections')
router.register(r'partylists', election.PartylistViewSet, basename='partylists')

elections_router = routers.NestedDefaultRouter(
    router,
    r'elections',
    lookup='election'
)
elections_router.register(
    r'courses',
    election.ElectionEligibleCourseViewSet,
    basename='election-courses'
)
elections_router.register(
    r'year_levels',
    election.ElectionEligibleYearLevelViewSet,
    basename='election-year-levels'
)
elections_router.register(
    r'positions',
    election.ElectionEligiblePositionViewSet,
    basename='election-positions'
)
elections_router.register(
    r'partylists',
    election.PartylistElectionViewSet,
    basename='election-partylists'
)
elections_router.register(
    r'vote',
    election.VoteViewSet,
    basename='election-votes'
)
elections_router.register(
    r'candidates',
    election.CandidateViewSet,
    basename='election-candidates'
)

urlpatterns = [
    path('',include(router.urls)),
    path('', include(elections_router.urls))
]