package com.icte.attendance.service;

import com.icte.attendance.model.LeaveRequest;
import com.icte.attendance.model.enums.LeaveStatus;
import com.icte.attendance.payload.request.LeaveRequestDto;

import java.util.List;

public interface LeaveService {
    LeaveRequest applyLeave(Long userId, LeaveRequestDto dto);
    List<LeaveRequest> getMyLeaves(Long userId);
    List<LeaveRequest> getAllLeaves();
    LeaveRequest updateLeaveStatus(Long leaveId, LeaveStatus status, Long adminId);
}
