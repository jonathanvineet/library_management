package com.library.service;

import com.library.model.Member;
import com.library.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Optional<Member> getMemberByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public List<Member> searchMembers(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllMembers();
        }
        return memberRepository.findByNameContainingIgnoreCase(name.trim());
    }

    public List<Member> getActiveMembers() {
        return memberRepository.findActiveMembers();
    }

    public List<Member> getMembersByStatus(Member.MemberStatus status) {
        return memberRepository.findByStatus(status);
    }

    public Member createMember(Member member) {
        // Check if email already exists
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("Member with email " + member.getEmail() + " already exists");
        }
        return memberRepository.save(member);
    }

    public Member updateMember(Long id, Member memberDetails) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));

        // Check if email is being changed and if new email already exists
        if (!member.getEmail().equals(memberDetails.getEmail()) &&
            memberRepository.existsByEmail(memberDetails.getEmail())) {
            throw new RuntimeException("Member with email " + memberDetails.getEmail() + " already exists");
        }

        member.setName(memberDetails.getName());
        member.setEmail(memberDetails.getEmail());
        member.setPhone(memberDetails.getPhone());
        member.setAddress(memberDetails.getAddress());
        member.setStatus(memberDetails.getStatus());
        member.setMaxBooksAllowed(memberDetails.getMaxBooksAllowed());

        return memberRepository.save(member);
    }

    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
        memberRepository.delete(member);
    }

    public Member updateMemberStatus(Long id, Member.MemberStatus status) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
        member.setStatus(status);
        return memberRepository.save(member);
    }
}
