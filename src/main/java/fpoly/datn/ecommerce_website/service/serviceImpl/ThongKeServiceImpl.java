package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.TopCustomersDTO;
import fpoly.datn.ecommerce_website.dto.TopProductsDTO;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.repository.IBillDetailRepository;
import fpoly.datn.ecommerce_website.repository.IBillRepository;
import fpoly.datn.ecommerce_website.repository.IProductDetailRepository;
import fpoly.datn.ecommerce_website.repository.IStaffRepository;
import fpoly.datn.ecommerce_website.service.IThongKeService;
import org.apache.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ThongKeServiceImpl implements IThongKeService {

    @Autowired
    IBillRepository billRepository;
    @Autowired
    IBillDetailRepository billDetailRepository;
    @Autowired
    IProductDetailRepository productDetailRepository;
    @Autowired
    IStaffRepository staffRepository;


    @Override
    public List<Bills> getBillsByDateRange(Date startDate, Date endDate) {
        return billRepository.findByBillCreateDateBetween(startDate, endDate);
    }

    @Override
    public int sumProductAmountByDateRange(Date startDate, Date endDate) {
        List<Bills> bills = getBillsByDateRange(startDate, endDate);
        return bills.stream().mapToInt(Bills::getProductAmount).sum();
    }
    @Override
    public List<Staffs> getAllStaffs() {
        return staffRepository.findAll();
    }
    @Override
    public int countStaffs() {
        return staffRepository.findAll().size();
    }

    @Override
    public BigDecimal calculateTotalPrice(Date startDate, Date endDate) {
        return billRepository.calculateTotalPrice(startDate,endDate);
    }

    @Override
    public BigDecimal calculateTotalPriceOffline(Date startDate, Date endDate) {
        return billRepository.calculateTotalPriceOffline(startDate,endDate);
    }

    @Override
    public BigDecimal calculateTotalPriceOnline(Date startDate, Date endDate) {
        return billRepository.calculateTotalPriceOnline(startDate,endDate);
    }

    @Override
    public BigDecimal calculateTotalPriceThisMonth() {
        return billRepository.calculateTotalPriceThisMonth();
    }

    @Override
    public BigDecimal calculateTotalPriceLastMonth() {
        return billRepository.calculateTotalPriceLastMonth();
    }

    @Override
    public BigDecimal calculateTotalPriceLastMonthByAll() {
        return billRepository.calculateTotalPriceLastMonthByAll();
    }


    private List<LocalDate> getAllDaysOfMonth(String month, String year) {
        int currentYear = Year.now().getValue();
        int currentMonth = YearMonth.now().getMonthValue();

        int targetYear = (year.equals("")) ? currentYear : Integer.parseInt(year);
        int targetMonth = (month.equals("")) ? currentMonth : Integer.parseInt(month);

        List<LocalDate> allDays = new ArrayList<>();
        LocalDate startDate = LocalDate.of(targetYear, targetMonth, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        while (!startDate.isAfter(endDate)) {
            allDays.add(startDate);
            startDate = startDate.plusDays(1);
        }

        return allDays;
    }

    @Override
    public List<Object[]> findTotalPricesByDay(String month, String year) throws ParseException {
        LocalDate currentDate = LocalDate.now();
        String currentMonth = String.valueOf(currentDate.getMonthValue());
        String currentYear = String.valueOf(currentDate.getYear());

        if (month.equalsIgnoreCase("") || year.equalsIgnoreCase("")) {
            currentMonth = String.valueOf(currentDate.getMonthValue());
            currentYear = String.valueOf(currentDate.getYear());
        } else {
            currentMonth = month;
            currentYear = year;
        }

        List<Object[]> totalPricesByDay = billRepository.findTotalPricesByDay(currentMonth, currentYear);
        Map<LocalDate, BigDecimal> pricesByDayMap = new HashMap<>();

        // Fill the map with the results from the database
        for (Object[] result : totalPricesByDay) {
            String dateString = (String) result[0];
            BigDecimal totalPrice;

            if (result[1] == null) {
                totalPrice = BigDecimal.ZERO;
            } else if (result[1] instanceof Double) {
                totalPrice = BigDecimal.valueOf((Double) result[1]);
            } else {
                totalPrice = (BigDecimal) result[1];
            }

            LocalDate billDate = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
            pricesByDayMap.put(billDate, totalPrice);
        }

        // Create a list of LocalDate for all days in the month
        List<LocalDate> allDaysOfMonth = getAllDaysOfMonth(month, year);

        // Fill the result list with day and corresponding price (or 0 if not found)
        List<Object[]> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        for (LocalDate day : allDaysOfMonth) {
            BigDecimal price = pricesByDayMap.getOrDefault(day, BigDecimal.ZERO);
            String formattedDate = day.format(formatter);
            result.add(new Object[]{formattedDate, price});
        }

        return result;
    }

    @Override
    public List<TopCustomersDTO> getTopCustomersByTotalPrice(Date startDate, Date endDate) {
        return billRepository.findTopCustomersByTotalPrice(PageRequest.of(0, 5), startDate, endDate);
    }

//    @Override
//    public List<TopProductsDTO> findTopProductsByTotalAmount(){
//        return billDetailRepository.findTopProductsByTotalAmount(PageRequest.of(0, 5));
//    }


    @Override
    public List<Object[]> findTopProductsSold(Date startDate, Date endDate) {

        List<Object[]> objects = this.productDetailRepository.findTop5Products(startDate, endDate,PageRequest.of(0, 5));
        return objects;
    }
    @Override
    public List<Object[]> findAllProductsBanDuoc(Date startDate, Date endDate, int pageNum, int pageSize) {
        List<Object[]> objects = this.productDetailRepository.findTop5Products(startDate, endDate,PageRequest.of(pageNum, pageSize));
        return objects;
    }
    @Override
    public List<Object[]> findAllProductsFail(Date startDate, Date endDate) {
        List<Object[]> objects = this.productDetailRepository.findProductFail(startDate, endDate);
        return objects;
    }
    @Override
    public Map<String, Double> findByBillCreateDateBetween(Date startDate, Date endDate){

        List<Bills> bills = this.getBillsByDateRange(startDate, endDate);
        int totalBills = bills.size();
        Map<Integer, Long> billStatusCounts = bills.stream()
                .collect(Collectors.groupingBy(Bills::getBillStatus, Collectors.counting()));

// Tính phần trăm cho mỗi trạng thái

        Map<String, Double> percentageByStatus = new HashMap<>();
        for (Map.Entry<Integer, Long> entry : billStatusCounts.entrySet()) {
            int status = entry.getKey();
            String stringStatus = "";
            if(status == 1){
                stringStatus = "ThanhCong";
            }else if(status == 2){
                stringStatus = "DangGiao";
            }
            else if(status == 3){
                stringStatus = "DangDongGoi";
            }
            else if(status == 4){
                stringStatus = "ChoXacNhan";
            }
            else if(status == -1){
                stringStatus = "DaHuy";
            }else{
                stringStatus = "KhongXacDinh";
            }
            long count = entry.getValue();
            double percentage = (count * 100.0) / totalBills;
            percentageByStatus.put(stringStatus, percentage);
        }

        return percentageByStatus;
    }
}
