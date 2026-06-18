package com.icte.attendance.service;

import com.icte.attendance.model.Attendance;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    Attendance checkIn(Long userId);
    Attendance checkOut(Long userId);
    List<Attendance> getAttendanceByUser(Long userId);
    Attendance getAttendanceByUserAndDate(Long userId, LocalDate date);
}
