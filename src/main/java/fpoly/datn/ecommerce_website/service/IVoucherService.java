package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.dto.VoucherDTO;
import fpoly.datn.ecommerce_website.entity.Vouchers;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IVoucherService {
    Page<Vouchers> findAllPage(Integer page, Integer size);

    List<Vouchers> fillAll();

    Vouchers getOne(String id);

    Vouchers add(Vouchers voucher);

    Vouchers update(Vouchers voucher);

    Vouchers updateStatus(String id, int status);


    Vouchers updateAmountBeforeAplied(String voucherId, int amount);

    void delete(String id);

    VoucherDTO findByVoucherCode(String voucherCode);
}
