package com.library.controller;

import com.library.model.Member;
import com.library.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Member> getMemberByEmail(@PathVariable String email) {
        return memberService.getMemberByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Member>> searchMembers(@RequestParam(required = false) String name) {
        return ResponseEntity.ok(memberService.searchMembers(name));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Member>> getActiveMembers() {
        return ResponseEntity.ok(memberService.getActiveMembers());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Member>> getMembersByStatus(@PathVariable Member.MemberStatus status) {
        return ResponseEntity.ok(memberService.getMembersByStatus(status));
    }

    @PostMapping
    public ResponseEntity<?> createMember(@Valid @RequestBody Member member) {
        try {
            Member createdMember = memberService.createMember(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id, @Valid @RequestBody Member member) {
        try {
            Member updatedMember = memberService.updateMember(id, member);
            return ResponseEntity.ok(updatedMember);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Member> updateMemberStatus(
            @PathVariable Long id,
            @RequestParam Member.MemberStatus status) {
        try {
            Member updatedMember = memberService.updateMemberStatus(id, status);
            return ResponseEntity.ok(updatedMember);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        try {
            memberService.deleteMember(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
