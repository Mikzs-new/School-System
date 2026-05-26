from apps.election.models.vote import Vote
from apps.election.models.candidate import Candidate

class VoteSelector:
    @staticmethod
    def student_already_vote(student_enrollment, election):
        return Vote.objects.filter(student_enrollment=student_enrollment,election=election).exists()
    