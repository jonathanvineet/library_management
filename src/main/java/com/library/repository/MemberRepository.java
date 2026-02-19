package com.library.repository;

import com.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    List<Member> findByNameContainingIgnoreCase(String name);

    List<Member> findByStatus(Member.MemberStatus status);

    @Query("SELECT m FROM Member m WHERE m.status = 'ACTIVE'")
    List<Member> findActiveMembers();

    boolean existsByEmail(String email);
}
