package com.icte.attendance.controller;

import com.icte.attendance.model.LeaveRequest;
import com.icte.attendance.model.enums.LeaveStatus;
import com.icte.attendance.payload.request.LeaveRequestDto;
import com.icte.attendance.security.services.UserDetailsImpl;
import com.icte.attendance.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequestDto dto, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            LeaveRequest leave = leaveService.applyLeave(userDetails.getId(), dto);
            return ResponseEntity.ok(leave);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-leaves")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(leaveService.getMyLeaves(userDetails.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @PutMapping("/{leaveId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long leaveId,
            @RequestParam String status,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            LeaveRequest updated = leaveService.updateLeaveStatus(
                    leaveId,
                    LeaveStatus.valueOf(status.toUpperCase()),
                    userDetails.getId()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
