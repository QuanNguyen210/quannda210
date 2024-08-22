package fpoly.datn.ecommerce_website.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class VoucherDTO {

    private String voucherId;
    private String voucherCode;
    private String voucherName;
    private Float discountPercent;
    private LocalDateTime voucherCreateDate;
    private String voucherType;
    private Double totalPriceToReceive;
    private Integer voucherAmount;
    private LocalDateTime voucherStartTime;
    private LocalDateTime voucherEndTime;
    private String voucherNote;
    private Integer voucherStatus;

}
