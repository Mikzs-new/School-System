from django.core.exceptions import ValidationError
from django.db import transaction

from election.models import Election, Candidate, Position, Vote, VoteItem    

from school.models import SchoolYearStudentInfo

@transaction.atomic
def cast_vote(*,student_info,election_id,vote_items_data):
    election = Election.objects.get(id=election_id)

    if not election.is_active:
        raise ValidationError('Election is not active')
    
    if Vote.objects.filter(election=election_id,student_info=student_info).exists():
        raise ValidationError('Student already voted')
    
    vote = Vote.objects.create(election=election,student_info=student_info)

    position_vote_count = {}
    
    for item in vote_items_data:
        candidate = Candidate.objects.select_related('election','position').get(id=item['candidate'])

        position = candidate.position

        if candidate.election_id != election.id:
            raise ValidationError('Candidate does not belong to election')
        
        current_count = position_vote_count.get(position.id, 0) + 1

        if current_count > position.seat_count:
            raise ValidationError(f'Too many selected for {position.title}')
        
        position_vote_count[position.id] = current_count

        VoteItem.objects.create(
            vote=vote,
            candidate=candidate,
            position=position
        )
    
    return vote