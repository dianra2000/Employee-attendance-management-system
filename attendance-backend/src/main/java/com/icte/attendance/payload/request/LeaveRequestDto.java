package com.icte.attendance.payload.request;

import lombok.Data;

@Data
public class LeaveRequestDto {
    private String leaveType;
    private String startDate;
    private String endDate;
    private String reason;
}
