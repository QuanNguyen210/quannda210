package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.VoucherDTO;
import fpoly.datn.ecommerce_website.entity.Vouchers;
import fpoly.datn.ecommerce_website.infrastructure.constant.Message;
import fpoly.datn.ecommerce_website.infrastructure.exception.rest.RestApiException;
import fpoly.datn.ecommerce_website.repository.IVoucherRepository;
import fpoly.datn.ecommerce_website.service.IVoucherService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoucherServiceImpl implements IVoucherService {

    @Autowired
    private IVoucherRepository iVoucherRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Page<Vouchers> findAllPage(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return iVoucherRepository.findAll(pageable);
    }

    @Override
    public List<Vouchers> fillAll() {
        return iVoucherRepository.findAll();
    }

    @Override
    public Vouchers getOne(String id) {
        return iVoucherRepository.findById(id).get();
    }

    @Override
    public Vouchers add(Vouchers voucher) {
        return iVoucherRepository.save(voucher);
    }

    @Override
    public Vouchers update(Vouchers voucher) {
        return  iVoucherRepository.save(voucher);
    }

    @Override
    public Vouchers updateStatus(String id, int status) {
        Vouchers voucher = iVoucherRepository.findById(id).get();
        voucher.setVoucherStatus(status);
        return iVoucherRepository.save(voucher);
    }


    @Override
    public Vouchers updateAmountBeforeAplied(String voucherId, int amount) {
        Vouchers voucher = iVoucherRepository.findById(voucherId).get();
        voucher.setVoucherAmount(voucher.getVoucherAmount() - amount);
        return iVoucherRepository.save(voucher);
    }
    @Override
    public void delete(String id) {

    }
    @Override
    public VoucherDTO findByVoucherCode(String voucherCode) {

        Vouchers vouchers = this.iVoucherRepository.findByVoucherCode(voucherCode);
        if (vouchers == null){
            throw new RestApiException(Message.valueOf("Not Found Voucher"));
        }
        return modelMapper.map(vouchers, VoucherDTO.class);
    }

}
