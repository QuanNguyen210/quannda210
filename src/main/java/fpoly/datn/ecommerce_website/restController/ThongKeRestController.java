package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.TopCustomersDTO;
import fpoly.datn.ecommerce_website.dto.TopProductsDTO;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.service.IThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class ThongKeRestController {

    @Autowired
    private IThongKeService thongKeService;

    @GetMapping("/thong-ke/amount-bill-amount-product")
    public Map<String, BigDecimal> getBillStatisticsByDateRange(
            @RequestParam(name ="startDate", defaultValue = "0001-01-01") String startDateStr,
            @RequestParam(name ="endDate", defaultValue = "9999-01-01") String endDateStr){
        try{
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
            List<Bills> bills = thongKeService.getBillsByDateRange(startDate, endDate);
            int totalStaffs = thongKeService.countStaffs();
            BigDecimal totalPrice = thongKeService.calculateTotalPrice(startDate,endDate);
            BigDecimal totalPriceOffline = thongKeService.calculateTotalPriceOffline(startDate,endDate);
            BigDecimal totalPriceOnline = thongKeService.calculateTotalPriceOnline(startDate,endDate);
            BigDecimal priceThisMonth = thongKeService.calculateTotalPriceThisMonth();
            BigDecimal priceLastMonth = thongKeService.calculateTotalPriceLastMonth();
            BigDecimal priceLastMonthByAll = thongKeService.calculateTotalPriceLastMonthByAll();
            int totalBillCount = 0;
            int totalBillCountChoXacNhan = 0;
            int totalBillCountDangDongGoi = 0;
            int totalBillCountDangGiao = 0;
            int totalBillCountThanhCong = 0;
            int totalBillFailCount = 0;
            int totalProductAmount = 0;
            for (Bills x: bills) {
                if(x.getBillStatus() == -1){
                    totalBillFailCount = totalBillFailCount +1;
                }
                if(x.getBillStatus() != -1){
                    totalBillCount = totalBillCount +1;
                    totalProductAmount = totalProductAmount + x.getProductAmount();
                    if(x.getBillStatus() == 4){
                        totalBillCountChoXacNhan = totalBillCountChoXacNhan + 1;
                    }else if(x.getBillStatus() == 3){
                        totalBillCountDangDongGoi = totalBillCountDangDongGoi + 1;
                    }else if(x.getBillStatus() == 2){
                        totalBillCountDangGiao = totalBillCountDangGiao + 1;
                    }else if(x.getBillStatus() == 1){
                        totalBillCountThanhCong = totalBillCountThanhCong + 1;
                    }
                }
            }
            BigDecimal tiLeDoanhThu = BigDecimal.ZERO;
            if (priceLastMonth.compareTo(BigDecimal.ZERO) != 0) {
                tiLeDoanhThu = priceThisMonth.divide(priceLastMonth, 5, RoundingMode.HALF_UP)
                        .subtract(BigDecimal.ONE)
                        .multiply(new BigDecimal(100));
            }
            BigDecimal tiLeDoanhThuCaThang = BigDecimal.ZERO;
            if (priceLastMonth.compareTo(BigDecimal.ZERO) != 0) {
                tiLeDoanhThuCaThang = priceThisMonth.divide(priceLastMonthByAll, 5, RoundingMode.HALF_UP)
                        .subtract(BigDecimal.ONE)
                        .multiply(new BigDecimal(100));
            }

            Map<String, BigDecimal> response = new HashMap<>();
            response.put("totalBillsCount", BigDecimal.valueOf(totalBillCount));
            response.put("totalBillsCountChoXacNhan", BigDecimal.valueOf(totalBillCountChoXacNhan));
            response.put("totalBillsCountDangDongGoi", BigDecimal.valueOf(totalBillCountDangDongGoi));
            response.put("totalBillsCountDangGiao", BigDecimal.valueOf(totalBillCountDangGiao));
            response.put("totalBillsCountThanhCong", BigDecimal.valueOf(totalBillCountThanhCong));
            response.put("totalBillsFailCount", BigDecimal.valueOf(totalBillFailCount));
            response.put("totalStaffsCount", BigDecimal.valueOf(totalStaffs));
            response.put("totalProductAmount", BigDecimal.valueOf(totalProductAmount));
            response.put("doanhThuSoVoiThangTruoc", tiLeDoanhThu);
            response.put("doanhThuCaThangSoVoiThangTruoc", tiLeDoanhThuCaThang);
            response.put("doanhThuThangTruoc", priceLastMonth);
            response.put("doanhThuThangNay", priceThisMonth);
            response.put("doanhThuCaThangTruoc", priceLastMonthByAll);
            response.put("doanhThuTrongKhoangNgay", totalPrice);
            response.put("doanhThuOfflineTrongKhoangNgay", totalPriceOffline);
            response.put("doanhThuOnlineTrongKhoangNgay", totalPriceOnline);

            return response;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/thong-ke/total-prices-by-day")
    public List<Object[]> getTotalPricesByDay(
            @RequestParam(name ="month", defaultValue = "") String month,
            @RequestParam(name ="year", defaultValue = "") String year) {
        return thongKeService.findTotalPricesByDay(month, year);
    }

    @GetMapping("/thong-ke/top-customer")
    public ResponseEntity<List<TopCustomersDTO>> getTopStaffsByTotalPrice(
            @RequestParam(name ="startDate", defaultValue = "0001-01-01") String startDateStr,
            @RequestParam(name ="endDate", defaultValue = "9999-01-01") String endDateStr) {
        try{
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
            List<TopCustomersDTO> topCustomers = thongKeService.getTopCustomersByTotalPrice(startDate, endDate);
            return new ResponseEntity<>(topCustomers, HttpStatus.OK);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }

//    @GetMapping("/thong-ke/top-product")
//    public ResponseEntity<List<TopProductsDTO>> getTopProduct() {
//        List<TopProductsDTO> topProduct = thongKeService.findTopProductsByTotalAmount();
//        return new ResponseEntity<>(topProduct, HttpStatus.OK);
//    }

    @GetMapping("/thong-ke/top-products")
    public ResponseEntity<List<Object []>> getTopProducts(@RequestParam("startDate") String startDateStr,
                                                          @RequestParam("endDate") String endDateStr
    ) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse(startDateStr);
        Date endDate = dateFormat.parse(endDateStr);
        List<Object []> topProducts = this.thongKeService.findTopProductsSold(startDate, endDate);
        return new ResponseEntity<>(topProducts, HttpStatus.OK);
    }

    @GetMapping("/thong-ke/top-products-fail")
    public ResponseEntity<List<Object []>> getProductsFail(@RequestParam("startDate") String startDateStr,
                                                           @RequestParam("endDate") String endDateStr
    ) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse(startDateStr);
        Date endDate = dateFormat.parse(endDateStr);
        List<Object []> topProducts = this.thongKeService.findAllProductsFail(startDate, endDate);
        return new ResponseEntity<>(topProducts, HttpStatus.OK);
    }

    @GetMapping("/thong-ke/statisticPercentByBillStatus")
    public Map<String, Double> findByBillCreateDateBetween(@RequestParam("startDate") String startDateStr,
                                                           @RequestParam("endDate") String endDateStr) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse(startDateStr);
        Date endDate = dateFormat.parse(endDateStr);
        return this.thongKeService.findByBillCreateDateBetween(startDate, endDate);
    }

}