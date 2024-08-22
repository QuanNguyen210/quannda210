package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.BillsDTO;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.service.IBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import java.util.Map;

import java.util.List;


@RestController
@RequestMapping("/api")
public class BillRestController {

    @Autowired
    private IBillService billService;
    @Autowired
    private ModelMapper modelMapper;

    @RequestMapping(value = "/bills", method = RequestMethod.GET)
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        if (pageNum == null && pageSize == null) {
            return new ResponseEntity<>(this.billService.getAll(), HttpStatus.OK);
        }
        return new ResponseEntity<>(this.billService.getPagination(pageNum, pageSize), HttpStatus.OK);
    }

    @RequestMapping(value = "/bills/pagination", method = RequestMethod.GET)
    public ResponseEntity<?> getAllPagination(
            @RequestParam(name = "page", defaultValue = "0") Integer pageNum,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize,
            @RequestParam(name ="status", required = false) Integer status,
            @RequestParam(name ="search", defaultValue = "") String search,
            @RequestParam(name ="startDate", defaultValue = "0001-01-01") String startDateStr,
            @RequestParam(name ="endDate", defaultValue = "9999-01-01") String endDateStr,
            @RequestParam(name = "customerRanking", required = false) String customerRanking,
            @RequestParam(name = "customerId", defaultValue = "") String customerId,
            @RequestParam(defaultValue = "billCreateDate") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
    ) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
            return new ResponseEntity<>(this.billService.getAllBillsOnline(customerId, customerRanking,startDate, endDate, status, search, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);
        } catch (ParseException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Lỗi khi chuyển đổi ngày", HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/bills/bill-offline", method = RequestMethod.GET)
    public ResponseEntity<?> getAllBillsOffline(
            @RequestParam(name = "page", defaultValue = "0") Integer pageNum,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize,
            @RequestParam(name ="status", required = false) Integer status,
            @RequestParam(name ="search", defaultValue = "") String search,
            @RequestParam(name ="startDate", defaultValue = "0001-01-01") String startDateStr,
            @RequestParam(name ="endDate", defaultValue = "9999-01-01") String endDateStr,
            @RequestParam(name = "customerRanking", required = false) String customerRanking,
            @RequestParam(name = "customerId", defaultValue = "") String customerId,
            @RequestParam(name = "staffId", defaultValue = "") String staffId,
            @RequestParam(name = "loaiHoaDon", defaultValue = "") String loaiHoaDon,
            @RequestParam(defaultValue = "billCreateDate") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
    ) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
            if(loaiHoaDon.equalsIgnoreCase("offline")){
                return new ResponseEntity<>(this.billService.getAllBillsOffline(staffId, customerId, customerRanking,startDate, endDate, status, search, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);
            }else if(loaiHoaDon.equalsIgnoreCase("online")){
                return new ResponseEntity<>(this.billService.getAllBillsOnline(customerId, customerRanking,startDate, endDate, status, search, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(this.billService.getAllBills(staffId, customerId, customerRanking,startDate, endDate, status, search, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Lỗi khi chuyển đổi ngày", HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value = "/bills/customer", method = RequestMethod.GET)
    public ResponseEntity<?> getAllBillOfCustomer(
            @RequestParam(name = "page", defaultValue = "0") Integer pageNum,
            @RequestParam(name = "size", defaultValue = "5") Integer pageSize,
            @RequestParam(name ="status", required = false) Integer status,
            @RequestParam(name = "customerId", defaultValue = "") String customerId,
            @RequestParam(defaultValue = "billCreateDate") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
    ) {
            return new ResponseEntity<>(this.billService.getAllBillsCustomer(customerId, status, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);

    }

    @RequestMapping(value = "/bills/update-status", method = RequestMethod.PUT)
    public ResponseEntity<Bills> updateStatus(@RequestParam String id, @RequestParam int status) {
        return new ResponseEntity<>(billService.updateStatus(id, status),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/bills", method = RequestMethod.POST)
    public ResponseEntity<?> save(
            @RequestBody BillsDTO billsDTO) {
        return new ResponseEntity<>(this.billService.save(billsDTO), HttpStatus.OK);
    }
    @GetMapping("/bills/total")
    public ResponseEntity<BigDecimal> getTotalSalesByTimePeriod(
            @RequestParam("start_date") String startDateString,
            @RequestParam("end_date") String endDateString) {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date startDate = formatter.parse(startDateString);
            Date endDate = formatter.parse(endDateString);

            BigDecimal totalSales = this.billService.calculateTotalSalesByTimePeriod(startDate, endDate);
            return ResponseEntity.ok(totalSales);
        } catch (ParseException e) {

            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/last30days")
    public ResponseEntity<Map<LocalDate, BigDecimal>> getSalesForLast30Days() {
        Map<LocalDate, BigDecimal> salesByDay = this.billService.getSalesForLast30Days();
        return ResponseEntity.ok(salesByDay);
    }

}