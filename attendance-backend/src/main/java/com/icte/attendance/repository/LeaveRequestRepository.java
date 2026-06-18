package com.icte.attendance.repository;

import com.icte.attendance.model.LeaveRequest;
import com.icte.attendance.model.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserId(Long userId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
}
