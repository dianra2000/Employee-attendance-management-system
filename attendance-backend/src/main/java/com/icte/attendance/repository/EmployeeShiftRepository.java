package com.icte.attendance.repository;

import com.icte.attendance.model.EmployeeShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, Long> {
    List<EmployeeShift> findByUserId(Long userId);
    List<EmployeeShift> findByUserIdAndAssignedDate(Long userId, LocalDate date);
}
