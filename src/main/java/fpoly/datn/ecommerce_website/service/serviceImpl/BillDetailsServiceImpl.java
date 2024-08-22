package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.BillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.BillDetailsQDTO;
import fpoly.datn.ecommerce_website.dto.BillsDTO;
import fpoly.datn.ecommerce_website.dto.GetBillDetailsDTO;
import fpoly.datn.ecommerce_website.entity.BillDetails;
import fpoly.datn.ecommerce_website.entity.BillDetails_ChiTiet;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import fpoly.datn.ecommerce_website.repository.IBillDetailRepository;
import fpoly.datn.ecommerce_website.service.IBillDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillDetailsServiceImpl implements IBillDetailsService {
    @Autowired
    private IBillDetailRepository iBillDetailRepository;
    @Autowired
    private ModelMapper modelMapper;

    private List<Sort.Order> createSortOrder(List<String> sortList, String sortDirection) {
        List<Sort.Order> sorts = new ArrayList<>();
        Sort.Direction direction;
        for (String sort : sortList) {
            if (sortDirection != null) {
                direction = Sort.Direction.fromString(sortDirection);
            } else {
                direction = Sort.Direction.DESC;
            }
            sorts.add(new Sort.Order(direction, sort));
        }
        return sorts;
    }

    @Override
    public List<GetBillDetailsDTO> getAll() {
        List<BillDetails> bills = this.iBillDetailRepository.findAll();
        return bills.stream()
                .map(bill -> modelMapper.map(bill, GetBillDetailsDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Page<BillDetailsDTO> getPagination( int pageNum, int pageSize) {
        Pageable pageable = PageRequest.of(pageNum, pageSize);
        Page<BillDetails> bills = this.iBillDetailRepository.findAll(pageable);
        return bills.map(bill -> modelMapper.map(bill, BillDetailsDTO.class));
    }


    @Override
    public BillDetailsQDTO getOne(String id) {
//        BillDetails bill = this.iBillDetailRepository.findBillDetailsById(id);
        return  modelMapper.map(this.iBillDetailRepository.findBillDetailsById(id), BillDetailsQDTO.class);
    }

    @Override
    public List<BillDetailsQDTO> findAllByBillId(String billID, Integer status) {
        List<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllByBillId(billID, status);
        return bills.stream()
                .map(bill -> modelMapper.map(bill, BillDetailsQDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Page<BillDetailsQDTO> findAllBillDetailError(
            String loaiHoaDon,
            String staffId,
            String customerId,
            Date startDate,
            Date endDate,
            Integer status,
            String search,
            int pageNum,
            int pageSize
    ) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize);
            if(loaiHoaDon.equalsIgnoreCase("online")){ // getAll bill online
                if(customerId == null || customerId.length()==0){
                    Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOnline(startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                }
//                else if(customerId.equalsIgnoreCase("khachHangLe")){
//                    Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOnlineKhachHangLe(startDate, endDate, status, search, pageable);
//                    return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
//                }
                else{
                    Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOnlineCustomer(customerId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                }
            }else if(loaiHoaDon.equalsIgnoreCase("offline")){ // getAll bill offline
                if(staffId == null || staffId.length() ==0) {
                    if(customerId == null || customerId.length() ==0) {
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOffline(startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }else {
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOfflineCustomer(customerId, startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }
                } else {
                    if(customerId == null || customerId.length() ==0) {
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOfflineStaff(staffId, startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }else {
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOfflineStaffCustomer(staffId,customerId, startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }
                }
            }else{
                if(customerId == null || customerId.length()==0){
                    if(staffId == null || staffId.length()==0){
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailError(startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }else{
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorStaff(staffId,startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }
                }else{
                    if(staffId == null || staffId.length() == 0){
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorCustomer(customerId,startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }else{
                        Page<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllBillDetailErrorOfflineStaffCustomer(staffId,customerId,startDate, endDate, status, search, pageable);
                        return bills.map(bill -> modelMapper.map(bill, BillDetailsQDTO.class));
                    }

                }

            }


    }

    @Override
    public List<BillDetailsQDTO> findAllByBillIdUpdateAmount(String billID) {
        List<BillDetails_ChiTiet> bills = this.iBillDetailRepository.findAllByBillIdUpdateAmount(billID);
        return bills.stream()
                .map(bill -> modelMapper.map(bill, BillDetailsQDTO.class))
                .collect(Collectors.toList());
    }


    @Override
    public BillDetailsDTO save(BillDetailsDTO billDetailsDTO) {
        BillDetails billDetails = modelMapper.map(billDetailsDTO, BillDetails.class);

        return modelMapper.map(this.iBillDetailRepository.save(billDetails), BillDetailsDTO.class);
    }

    @Override
    public BillDetailsQDTO updateAmountProduct(BillDetailsQDTO billDetailsQDTO) {
        BillDetails billDetails = modelMapper.map(billDetailsQDTO, BillDetails.class);

        return modelMapper.map(this.iBillDetailRepository.save(billDetails), BillDetailsQDTO.class);
    }

    @Override
    public BillDetailsDTO update(BillDetailsDTO billDetailsDTO) {
        BillDetails billDetails = modelMapper.map(billDetailsDTO, BillDetails.class);
        return modelMapper.map(this.iBillDetailRepository.save(billDetails), BillDetailsDTO.class);
    }

    @Override
    public Boolean delete(String id) {
        BillDetails billDetails = this.iBillDetailRepository.getReferenceById(id);
        if (billDetails != null) {
            this.iBillDetailRepository.delete(billDetails);
            return true;
        }
        return false;
    }
}
