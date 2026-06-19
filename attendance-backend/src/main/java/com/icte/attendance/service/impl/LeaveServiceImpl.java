package com.icte.attendance.service.impl;

import com.icte.attendance.model.LeaveRequest;
import com.icte.attendance.model.User;
import com.icte.attendance.model.enums.LeaveStatus;
import com.icte.attendance.model.enums.LeaveType;
import com.icte.attendance.payload.request.LeaveRequestDto;
import com.icte.attendance.repository.LeaveRequestRepository;
import com.icte.attendance.repository.UserRepository;
import com.icte.attendance.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public LeaveRequest applyLeave(Long userId, LeaveRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setUser(user);
        leaveRequest.setLeaveType(LeaveType.valueOf(dto.getLeaveType()));
        leaveRequest.setStartDate(LocalDate.parse(dto.getStartDate()));
        leaveRequest.setEndDate(LocalDate.parse(dto.getEndDate()));
        leaveRequest.setReason(dto.getReason());
        leaveRequest.setStatus(LeaveStatus.PENDING);

        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public List<LeaveRequest> getMyLeaves(Long userId) {
        return leaveRequestRepository.findByUserId(userId);
    }

    @Override
    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    @Override
    public LeaveRequest updateLeaveStatus(Long leaveId, LeaveStatus status, Long adminId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        leaveRequest.setStatus(status);
        leaveRequest.setApprovedBy(admin);

        return leaveRequestRepository.save(leaveRequest);
    }
}
