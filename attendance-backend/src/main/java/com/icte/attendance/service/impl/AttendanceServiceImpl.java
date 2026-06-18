package com.icte.attendance.service.impl;

import com.icte.attendance.model.Attendance;
import com.icte.attendance.model.User;
import com.icte.attendance.model.enums.AttendanceStatus;
import com.icte.attendance.repository.AttendanceRepository;
import com.icte.attendance.repository.UserRepository;
import com.icte.attendance.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Attendance checkIn(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate today = LocalDate.now();

        if (attendanceRepository.findByUserIdAndDate(userId, today).isPresent()) {
            throw new RuntimeException("Already checked in today");
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setDate(today);
        attendance.setStatus(AttendanceStatus.PRESENT); // Logic for LATE can be added here
        
        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance checkOut(Long userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out today");
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        
        // Calculate work hours
        Duration duration = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        attendance.setWorkHours(new BigDecimal(hours + "." + (minutes * 100 / 60)));

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAttendanceByUser(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    @Override
    public Attendance getAttendanceByUserAndDate(Long userId, LocalDate date) {
        return attendanceRepository.findByUserIdAndDate(userId, date).orElse(null);
    }
}
