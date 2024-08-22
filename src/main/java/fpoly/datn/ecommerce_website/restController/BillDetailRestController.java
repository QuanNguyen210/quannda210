package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.BillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.BillDetailsQDTO;
import fpoly.datn.ecommerce_website.dto.GetBillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.ProductDetailDTO;
import fpoly.datn.ecommerce_website.entity.BillDetails;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import fpoly.datn.ecommerce_website.service.IBillDetailsService;
import fpoly.datn.ecommerce_website.service.IProductDetalisService;

import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class BillDetailRestController {

    @Autowired
    private IBillDetailsService iBillDetailsService;
    @Autowired
    private IProductDetalisService iProductDetailsService;
    @Autowired
    private ModelMapper modelMapper;

    @RequestMapping(value = "/bill-details/", method = RequestMethod.GET)
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        if (pageNum == null && pageSize == null) {
            return new ResponseEntity<>(this.iBillDetailsService.getAll(), HttpStatus.OK);
        }
        return new ResponseEntity<>(this.iBillDetailsService.getPagination(pageNum, pageSize), HttpStatus.OK);
    }

    @RequestMapping(value = "/bill-details", method = RequestMethod.POST)
    public ResponseEntity<?> save(
            @RequestBody BillDetailsDTO billDetailsDTO) {
        System.out.println("billDetailsDTO.toString()");

        return new ResponseEntity<>(this.iBillDetailsService.save(billDetailsDTO), HttpStatus.OK);
    }

    @RequestMapping(value = "bill-detail/getBillDetailsByBillId", method = RequestMethod.GET)
    public ResponseEntity<?> getAllbyBillId(@RequestParam (name ="billId") String billId,
                                            @RequestParam(name ="status", required = false) Integer status
                                            ) {
        return new ResponseEntity<>(
                this.iBillDetailsService.findAllByBillId(billId, status)
                        .stream()
                        .map(billDetails -> modelMapper.map(billDetails, GetBillDetailsDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK
        );
    }

    @RequestMapping(value = "bill-detail/getBillDetailsByBillIdNotStatus", method = RequestMethod.GET)
    public ResponseEntity<?> getAllBillDetailError(
            @RequestParam(name = "page", defaultValue = "0") Integer pageNum,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize,
            @RequestParam(name ="status", required = false) Integer status,
            @RequestParam(name ="search", defaultValue = "") String search,
            @RequestParam(name ="startDate", defaultValue = "0001-01-01") String startDateStr,
            @RequestParam(name ="endDate", defaultValue = "9999-01-01") String endDateStr,
            @RequestParam(name = "customerId", defaultValue = "") String customerId,
            @RequestParam(name = "staffId", defaultValue = "") String staffId,
            @RequestParam(name = "loaiHoaDon", defaultValue = "") String loaiHoaDon
    ) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = dateFormat.parse(endDateStr);
//            if(loaiHoaDon.equalsIgnoreCase("offline")){
//                return new ResponseEntity<>(this.iBillDetailsService.findAllBillDetailErrorOffline(staffId, customerId,startDate, endDate, status, search, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);
//            }else if(loaiHoaDon.equalsIgnoreCase("online")){
//                return new ResponseEntity<>(this.iBillDetailsService.findAllBillDetailErrorOnline(customerId,startDate, endDate, status, search, pageNum, pageSize, sortList, sortOrder.toString()), HttpStatus.OK);
//            }else{
                return new ResponseEntity<>(this.iBillDetailsService.findAllBillDetailError(loaiHoaDon, staffId, customerId, startDate, endDate, status, search, pageNum, pageSize), HttpStatus.OK);
//            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Lỗi ", HttpStatus.BAD_REQUEST);
        }
//        return new ResponseEntity<>(
//                this.iBillDetailsService.findAllBillDetailError( pageNum, pageSize)
//                        .stream()
//                        .map(billDetails -> modelMapper.map(billDetails, GetBillDetailsDTO.class))
//                        .collect(Collectors.toList())
//                , HttpStatus.OK
//        );
    }

    @RequestMapping(value = "bill-detail/getBillDetailsByBillIdOfQuan", method = RequestMethod.GET)
    public ResponseEntity<?> getAllbyBillIdOfQuan(@RequestParam (name ="billId") String billId,
                                                  @RequestParam(name ="status", required = false) Integer status
    ) {
        return new ResponseEntity<>(
                this.iBillDetailsService.findAllByBillId(billId, status)
                        .stream()
                        .map(billDetails -> modelMapper.map(billDetails, BillDetailsQDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK
        );

    }

    @RequestMapping(value = "bill-detail/getBillDetailsByBillIdUpdateAmount", method = RequestMethod.GET)
    public ResponseEntity<?> getBillDetailsByBillIdUpdateAmount(@RequestParam (name ="billId") String billId
    ) {
        return new ResponseEntity<>(
                this.iBillDetailsService.findAllByBillIdUpdateAmount(billId)
                        .stream()
                        .map(billDetails -> modelMapper.map(billDetails, BillDetailsQDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK
        );

    }

    @RequestMapping(value = "/bill-details/getOne", method = RequestMethod.GET)
        public ResponseEntity<?> getOne( @RequestParam @NotNull String billDetailId ) {
            return new ResponseEntity<>(this.iBillDetailsService.getOne(billDetailId), HttpStatus.OK);
    }

    @RequestMapping(value = "/bill-detail/update-amount-product-detail", method = RequestMethod.PUT)
    public ResponseEntity<?> updateAmountProductDetail(
            @RequestParam @NotNull String billDetailId,
            @RequestParam @NotNull Integer amount) {
        BillDetailsQDTO billDetailsDTO = this.iBillDetailsService.getOne(billDetailId);
        int oldAmount = billDetailsDTO.getAmount();
        int newAmountProduct = billDetailsDTO.getProductDetails().getProductDetailAmount()+oldAmount-amount;
        if(newAmountProduct < 0) {
            return  new ResponseEntity<>( "Số lượng upadte không hợp lệ!!!"
                    , HttpStatus.CONFLICT);
        } else if (amount == 0){
            int tongSPTrongBill = (billDetailsDTO.getBills().getProductAmount()) - oldAmount + amount;
            billDetailsDTO.getBills().setProductAmount(tongSPTrongBill);
            billDetailsDTO.getProductDetails().setProductDetailAmount(newAmountProduct);
            billDetailsDTO.setAmount(amount);
            billDetailsDTO.setBillDetailStatus(-1);
            return new ResponseEntity<>(this.iBillDetailsService.updateAmountProduct(billDetailsDTO), HttpStatus.OK);
        }else{
            // update tổng sp ở bill
            int tongSPTrongBill = (billDetailsDTO.getBills().getProductAmount()) - oldAmount + amount;
            billDetailsDTO.getBills().setProductAmount(tongSPTrongBill);
            // update số lượng ở sản phẩm chi tiết
            billDetailsDTO.getProductDetails().setProductDetailAmount(newAmountProduct);
            // update số lượng ở billdetails
            billDetailsDTO.setAmount(amount);
//        BillDetailsDTO billDetailsDTO1 = modelMapper.map(billDetailsDTO, BillDetailsDTO.class);
            return new ResponseEntity<>(this.iBillDetailsService.updateAmountProduct(billDetailsDTO), HttpStatus.OK);
        }

    }

    @RequestMapping(value = "/bill-detail/update-amount-product-error", method = RequestMethod.PUT)
    public ResponseEntity<?> updateAmountProductError(
            @RequestParam @NotNull String billDetailId,
            @RequestParam @NotNull Integer amountError) {
        BillDetailsQDTO billDetailsDTO = this.iBillDetailsService.getOne(billDetailId);
        int oldAmount = billDetailsDTO.getAmount();
//        int newAmountProduct = billDetailsDTO.getProductDetails().getProductDetailAmount() - amountError;
        if(oldAmount - amountError < 0) {
            return  new ResponseEntity<>( "Số lượng upadte không hợp lệ!!!"
                    , HttpStatus.CONFLICT);
        }else if (oldAmount - amountError == 0) {
            int tongSPTrongBill = (billDetailsDTO.getBills().getProductAmount()) - amountError ;
            billDetailsDTO.getBills().setProductAmount(tongSPTrongBill);
            billDetailsDTO.setAmount(oldAmount - amountError);
            billDetailsDTO.setBillDetailStatus(-1);
            return new ResponseEntity<>(this.iBillDetailsService.updateAmountProduct(billDetailsDTO), HttpStatus.OK);
        }else{
            // update tổng sp ở bill
            int tongSPTrongBill = (billDetailsDTO.getBills().getProductAmount()) - amountError ;
            billDetailsDTO.getBills().setProductAmount(tongSPTrongBill);
            // update số lượng ở sản phẩm chi tiết
//        billDetailsDTO.getProductDetails().setProductDetailAmount(newAmountProduct);
            // update số lượng ở billdetails
            billDetailsDTO.setAmount(oldAmount - amountError);
//        BillDetailsDTO billDetailsDTO1 = modelMapper.map(billDetailsDTO, BillDetailsDTO.class);
            return new ResponseEntity<>(this.iBillDetailsService.updateAmountProduct(billDetailsDTO), HttpStatus.OK);
        }

    }

//    @RequestMapping(value = "/bills/update-status", method = RequestMethod.PUT)
//    public ResponseEntity<BillDetailsDTO> updateStatus(@RequestParam String id, @RequestParam int status) {
//        return new ResponseEntity<>(iBillDetailsService.updateStatus(id, status),
//                HttpStatus.OK);
//    }

//    @RequestMapping(value = "bill-detail/getBillDetailsProductsById", method = RequestMethod.GET)
//    public ResponseEntity<?> getAllBillDetailProductsById(@RequestParam (name ="billId") String billId) {
//        return new ResponseEntity<>(
//                this.iBillDetailsService.findAllBillProduct(billId)
//                        .stream()
//                        .map(billDetails -> modelMapper.map(billDetails, BillDetailsDTO.class))
//                        .collect(Collectors.toList())
//                , HttpStatus.OK
//        );
//
//    }
}