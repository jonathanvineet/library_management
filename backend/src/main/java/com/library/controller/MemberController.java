package com.library.controller;

import com.library.dto.MemberResponse;
import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<MemberResponse>> getAllMembers() {
        List<User> members = userRepository.findByRole("MEMBER");
        List<MemberResponse> response = members.stream()
            .map(MemberResponse::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MemberResponse> getMemberById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> ResponseEntity.ok(new MemberResponse(user)))
            .orElse(ResponseEntity.notFound().build());
    }
}
