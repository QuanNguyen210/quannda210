package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.BillsDTO;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import fpoly.datn.ecommerce_website.repository.IBillRepository;
import fpoly.datn.ecommerce_website.service.IBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class BillServiceImpl implements IBillService {
    @Autowired
    private IBillRepository iBillRepository;
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
    public List<BillsDTO> getAll() {
        List<Bills> bills = this.iBillRepository.findAll();

        return bills.stream()
                .map(b -> modelMapper.map(b, BillsDTO.class))
                .toList();
//        return bills;
    }

    @Override
    public Page<BillsDTO> getPagination(int pageNum, int pageSize) {
        Pageable pageable = PageRequest.of(pageNum, pageSize);
        Page<Bills> bills = this.iBillRepository.findAll(pageable);
        return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
    }

    @Override
    public Page<BillsDTO> getAllBillsOnline(String customerId, String customerRanking, Date startDate, Date endDate, Integer status, String search, int pageNum, int pageSize, List<String> sortList,
                                            String sortOrder) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        if(customerRanking.length() == 0){ // get all bill online
            if(customerId.length() == 0 || customerId == null){
                // trường hợp không chọn Hạng và cũng không chọn khách hàng
                Page<Bills> bills = this.iBillRepository.findAllBillsOnline(startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
            else{
                // trường hợp không chọn hạng nhưng chọn khách hàng
                Page<Bills> bills = this.iBillRepository.findAllBillsOnlineCustomerId(customerId, startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
        }else if (customerRanking.equalsIgnoreCase("khachHangLe")){
            // trường hợp chọn hạng khách hàng lẻ
            Page<Bills> bills = this.iBillRepository.findAllBillsOnlineKhachHangLe(startDate, endDate, status, search, pageable);
            return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
        }else{
            Ranking mappingRank = Ranking.valueOf(customerRanking);
            //tất cả trường hợp chọn cả hạng và không chọn khách hàng
            if(customerId.length() == 0 || customerId == null){
                Page<Bills> bills = this.iBillRepository.findAllBillsOnlineCustomerRanking( mappingRank,startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
            Page<Bills> bills = this.iBillRepository.findAllBillsOnlineCustomerRankingAndCustomerId(customerId, mappingRank,startDate, endDate, status, search, pageable);
            return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
        }

    }

    @Override
    public Page<BillsDTO> getAllBills(String staffId, String customerId, String customerRanking, Date startDate, Date endDate, Integer status, String search, int pageNum, int pageSize, List<String> sortList,
                                             String sortOrder) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        if(staffId.length() == 0){
            // get all bill khi không chọn nhân viên
            if(customerRanking.length() == 0){
                if(customerId.length() == 0 || customerId == null){
                    // trường hợp không chọn Hạng và cũng không chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBills(startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                else{
                    // trường hợp không chọn hạng nhưng chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerId(customerId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
            }else if (customerRanking.equalsIgnoreCase("khachHangLe")){
                // trường hợp chọn hạng khách hàng lẻ
                Page<Bills> bills = this.iBillRepository.findAllBillsKhachHangLe(startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }else{
                Ranking mappingRank = Ranking.valueOf(customerRanking);
                //tất cả trường hợp chọn cả hạng và không chọn khách hàng
                if(customerId.length() == 0 || customerId == null){
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRanking( mappingRank,startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingAndCustomerId(customerId, mappingRank,startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
        }else{
            // lọc tiếp theo khi đã chọn nhân viên
            if(customerRanking.length() == 0){
                if(customerId.length() == 0 || customerId == null){
                    // trường hợp không chọn Hạng và cũng không chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsOfStaff(staffId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                else{
                    // trường hợp không chọn hạng nhưng chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerIdOfStaff(staffId, customerId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
            }else if (customerRanking.equalsIgnoreCase("khachHangLe")){
                // trường hợp chọn hạng khách hàng lẻ
                Page<Bills> bills = this.iBillRepository.findAllBillsKhachHangLeOfStaff(staffId, startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }else{
                Ranking mappingRank = Ranking.valueOf(customerRanking);
                //tất cả trường hợp chọn cả hạng và không chọn khách hàng
                if(customerId.length() == 0 || customerId == null){
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingOfStaff(staffId, mappingRank,startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingAndCustomerIdOfStaff(staffId, customerId, mappingRank,startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
        }

    }

    @Override
    public Page<BillsDTO> getAllBillsOffline(String staffId, String customerId, String customerRanking, Date startDate, Date endDate, Integer status, String search, int pageNum, int pageSize, List<String> sortList,
                                      String sortOrder) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        if(staffId.length() == 0){
            // get all bill khi không chọn nhân viên
            if(customerRanking.length() == 0){
                if(customerId.length() == 0 || customerId == null){
                    // trường hợp không chọn Hạng và cũng không chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsOffline(startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                else{
                    // trường hợp không chọn hạng nhưng chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerIdOffline(customerId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
            }else if (customerRanking.equalsIgnoreCase("khachHangLe")){
                // trường hợp chọn hạng khách hàng lẻ
                Page<Bills> bills = this.iBillRepository.findAllBillsKhachHangLeOffline(startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }else{
                Ranking mappingRank = Ranking.valueOf(customerRanking);
                //tất cả trường hợp chọn cả hạng và không chọn khách hàng
                if(customerId.length() == 0 || customerId == null){
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingOffline( mappingRank,startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingAndCustomerIdOffline(customerId, mappingRank,startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
        }else{
            // lọc tiếp theo khi đã chọn nhân viên
            if(customerRanking.length() == 0){
                if(customerId.length() == 0 || customerId == null){
                    // trường hợp không chọn Hạng và cũng không chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsOfStaffOffline(staffId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                else{
                    // trường hợp không chọn hạng nhưng chọn khách hàng
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerIdOfStaffOffline(staffId, customerId, startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
            }else if (customerRanking.equalsIgnoreCase("khachHangLe")){
                // trường hợp chọn hạng khách hàng lẻ
                Page<Bills> bills = this.iBillRepository.findAllBillsKhachHangLeOfStaffOffline(staffId, startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }else{
                Ranking mappingRank = Ranking.valueOf(customerRanking);
                //tất cả trường hợp chọn cả hạng và không chọn khách hàng
                if(customerId.length() == 0 || customerId == null){
                    Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingOfStaffOffline(staffId, mappingRank,startDate, endDate, status, search, pageable);
                    return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
                }
                Page<Bills> bills = this.iBillRepository.findAllBillsCustomerRankingAndCustomerIdOfStaffOffline(staffId, customerId, mappingRank,startDate, endDate, status, search, pageable);
                return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
            }
        }

    }

    @Override
    public Page<BillsDTO> getAllBillsCustomer(String customerId, Integer status, int pageNum, int pageSize, List<String> sortList, String sortOrder) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        Page<Bills> bills = this.iBillRepository.findAllBillsCustomer(customerId, status, pageable);
        return bills.map(bill -> modelMapper.map(bill, BillsDTO.class));
    }

    @Override
    public Bills updateStatus(String id, Integer status) {
        Bills bill = iBillRepository.findById(id).get();
        bill.setBillStatus(status);
        return this.iBillRepository.save(bill);
    }


    @Override
    public BillsDTO save(BillsDTO billsDTO) {
        Bills bills1 = this.iBillRepository.save(modelMapper.map(billsDTO, Bills.class));
        return modelMapper.map(bills1, BillsDTO.class);
    }

    @Override
    public BillsDTO getOne(String id) {
        Bills bills = this.iBillRepository.getReferenceById(id);
        if (bills == null) {
            return null;
        }
        return modelMapper.map(bills, BillsDTO.class);
    }

    @Override
    public BillsDTO update(BillsDTO billsDTO) {
        Bills bills = modelMapper.map(billsDTO, Bills.class);
        return modelMapper.map(this.iBillRepository.save(bills), BillsDTO.class);
    }

    @Override
    public Boolean delete(String id) {
        Bills bills = this.iBillRepository.getReferenceById(id);
        if (bills != null) {
            this.iBillRepository.delete(bills);
            return true;
        }
        return false;
    }

        @Override
        public BigDecimal calculateTotalSalesByTimePeriod(Date startDate, Date endDate) {
            List<Bills> bills = this.iBillRepository.findByBillCreateDateBetween(startDate, endDate);
            BigDecimal totalSales = bills.stream()
                    .map(Bills::getBillTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            return totalSales;
        }
    @Override
    public Map<LocalDate, BigDecimal> getSalesForLast30Days() {
        Map<LocalDate, BigDecimal> salesByDay = new LinkedHashMap<>();
        LocalDate currentDate = LocalDate.now();
        LocalDate startDate = currentDate.minusDays(30);

        while (!currentDate.isBefore(startDate)) {
            BigDecimal totalSales = iBillRepository.calculateTotalSalesForDate(currentDate);
            salesByDay.put(currentDate, totalSales);
            currentDate = currentDate.minusDays(1);
        }
        return salesByDay;
    }
}
