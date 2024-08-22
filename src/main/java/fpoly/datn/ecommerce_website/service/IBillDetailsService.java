package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.dto.BillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.BillDetailsQDTO;
import fpoly.datn.ecommerce_website.dto.GetBillDetailsDTO;
import fpoly.datn.ecommerce_website.entity.BillDetails;
import fpoly.datn.ecommerce_website.entity.BillDetails_ChiTiet;
import fpoly.datn.ecommerce_website.entity.ProductDetails;

import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;


public interface IBillDetailsService {
    List<GetBillDetailsDTO> getAll();

    Page<BillDetailsDTO> getPagination(int pageNum, int pageSize);

    BillDetailsQDTO getOne(String billDetailId);

    List<BillDetailsQDTO> findAllByBillId(String billID, Integer status) ;

    Page<BillDetailsQDTO> findAllBillDetailError(
            String loaiHoaDon,
            String staffId,
            String customerId,
            Date startDate,
            Date endDate,
            Integer status,
            String search,
            int pageNum,
            int pageSize);

    List<BillDetailsQDTO> findAllByBillIdUpdateAmount(String billID) ;


//    List<BillDetails> findAllBillProduct(String billId);

    BillDetailsDTO save(BillDetailsDTO billDetailsDTO);
    BillDetailsQDTO updateAmountProduct(BillDetailsQDTO billDetailsQDTO);

    BillDetailsDTO update(BillDetailsDTO billDetailsDTO);

    Boolean delete(String id);
}
