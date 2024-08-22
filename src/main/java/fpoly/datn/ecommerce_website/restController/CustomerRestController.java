package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.CustomerDTO;
import fpoly.datn.ecommerce_website.dto.CustomerDTO1;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import fpoly.datn.ecommerce_website.repository.ICustomerRepository;
import fpoly.datn.ecommerce_website.service.serviceImpl.CustomerServiceImpl;
import fpoly.datn.ecommerce_website.service.serviceImpl.UserServiceImpl;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.EnumMap;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CustomerRestController {

    @Autowired
    private CustomerServiceImpl customerService;
    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private UserServiceImpl userInfoService;
    @Autowired
    private ModelMapper modelMapper;

//    private final EnumMap<Ranking, String> rankingMapping = new EnumMap<>(Ranking.class);
//
//    public CustomerRestController() {
//        rankingMapping.put(Ranking.KH_TIEMNANG, "KH_TIEMNANG");
//        rankingMapping.put(Ranking.KH_BAC, "KH_BAC");
//        rankingMapping.put(Ranking.KH_KIMCUONG, "KH_KIMCUONG");
//        rankingMapping.put(Ranking.KH_VANG, "KH_VANG");
//        rankingMapping.put(Ranking.KH_THANTHIET, "KH_THANTHIET");
//    }

    @RequestMapping("/customer/")
    public ResponseEntity<List<CustomerDTO>> getAll() {
        List<Customers> list = customerService.findAll();
        return new ResponseEntity<>(
                list.stream().map(customer -> modelMapper.map(customer, CustomerDTO.class)).collect(Collectors.toList())
                , HttpStatus.OK
        );
    }

    @RequestMapping(value = "/customer/pagination", method = RequestMethod.GET)
    public ResponseEntity<?> getAllPage(
            @RequestParam(name = "page", defaultValue = "0") int pageNum,
            @RequestParam(name = "size", defaultValue = "15") int pageSize
    ) {
//        if(customerService.)
        Page<Customers> customerPage = customerService.findAllCustomersWithUserInfoUserRole(pageNum, pageSize);
        return new ResponseEntity<>
                (customerPage, HttpStatus.OK);
    }


    @RequestMapping(value = "/customer", method = RequestMethod.GET)
    public ResponseEntity<CustomerDTO> getOne(@RequestParam("customerId") String id) {
        return new ResponseEntity<>(
                modelMapper.map(customerService.findById(id), CustomerDTO.class)
                , HttpStatus.OK
        );

    }
    @RequestMapping(value = "/customer/findByUserId", method = RequestMethod.GET)
    public ResponseEntity<?> findByUserId(@RequestParam("userId") String userId) {
        return new ResponseEntity<>(
              this.customerRepository.findByUsersId(userId)
                , HttpStatus.OK
        );

    }

    @RequestMapping(value = "/customer", method = RequestMethod.POST)
    public ResponseEntity<?> add(@RequestBody CustomerDTO customerDTO) {
        return new ResponseEntity<>(this.customerService.save(customerDTO), HttpStatus.OK);
    }

    @RequestMapping(value = "/customer", method = RequestMethod.PUT)
    public ResponseEntity<?> update( @RequestBody CustomerDTO customerDTO) {
        return new ResponseEntity<>(customerService.update(customerDTO),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/customer/updateNotPassword", method = RequestMethod.PUT)
    public ResponseEntity<?> updateNotPassword( @RequestBody CustomerDTO customerDTO) {
        return new ResponseEntity<>(customerService.updateNotPassword(customerDTO),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/customer/update-status", method = RequestMethod.PUT)
    public ResponseEntity<Customers> updateStatus(@RequestParam String id, @RequestParam int status) {
        return new ResponseEntity<>(customerService.updateStatus(id, status),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/customer", method = RequestMethod.DELETE)
    public ResponseEntity<String> delete(@RequestParam String id) {
        return new ResponseEntity<>(this.customerService.delete(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/customer/forget-password", method = RequestMethod.PUT)
    public ResponseEntity<?> forgetPassword(
            @RequestParam(name = "customerId") String customerId,
            @RequestParam(name = "password") String password
    ) {
        return new ResponseEntity<>
                (customerService.forgetPassword(customerId, password), HttpStatus.OK);
    }

    //getAll of Quan
    @RequestMapping(value = "/customer/search", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSearch(
            @RequestParam(name = "page", defaultValue = "0") int pageNum,
            @RequestParam(name = "size", defaultValue = "10") int pageSize,
            @RequestParam(name ="keyword", defaultValue = "") String keyword,
            @RequestParam(name = "status", required = false) Integer status,
            @RequestParam(name = "gender", required = false) Boolean gender,
            @RequestParam(name = "ranking", required = false) String ranking,
            @RequestParam(defaultValue = "") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
    ) {
        if (ranking.length() != 0 ) {
            Ranking mappingRank = Ranking.valueOf(ranking);
            Page<Customers> customerSearchPage = customerService.findAllSearch(keyword, status, gender, mappingRank, pageNum, pageSize, sortList, sortOrder.toString());
            return ResponseEntity.ok(customerSearchPage);
        }else{
            Page<Customers> customerSearchPage = customerService.findAllSearch(keyword, status, gender, null, pageNum, pageSize, sortList, sortOrder.toString());
            return ResponseEntity.ok(customerSearchPage);
        }

    }
    @RequestMapping(value = "/customer/searchByKeyword", method = RequestMethod.GET)
    public ResponseEntity<?> findCustomerByKeyword(
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword
    ) {


        return new ResponseEntity<>
                (this.customerService.findCustomerByKeyword(keyword), HttpStatus.OK);
    }
    @RequestMapping(value = "/customer/findByEmail", method = RequestMethod.GET)
    public ResponseEntity<?> findCustomerByEmail(
            @RequestParam(name = "email") String email
    ) {
        return new ResponseEntity<>
                (this.customerRepository.findByEmail(email), HttpStatus.OK);
    }
    @RequestMapping(value = "/customer/updateConsumePoint", method = RequestMethod.PUT)
    public ResponseEntity<?> updateConsumePopint(
            @RequestParam(name = "customerId") String customerId,
            @RequestParam(name = "consumePoints") int consumePoints
    ) {
        return new ResponseEntity<>
                (this.customerService.updateConsumePoint(customerId,consumePoints ), HttpStatus.OK);
    }

    @RequestMapping(value = "/customer/findByPhoneNumber", method = RequestMethod.GET)
    public ResponseEntity<?> findByPhoneNumber(
            @RequestParam(name = "phoneNumber") String phoneNumber
    ) {
        Customers customers = this.customerRepository.findByPhoneNumber(phoneNumber);
        return new ResponseEntity<>
                (customers, HttpStatus.OK);
    }

    @RequestMapping(value = "/customer/updatePoint", method = RequestMethod.PUT)
    public ResponseEntity<?> updatePoint(
            @RequestParam(name = "customerId") String customerId,
            @RequestParam(name = "totalPrice") Double totalPrice
    ) {
        CustomerDTO customers = this.customerService.updatePointByTotalPrice(customerId, totalPrice);
        return new ResponseEntity<>
                (customers, HttpStatus.OK);
    }

    @PostMapping("/{customerId}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable("customerId") String userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword
    ) {
        boolean passwordChanged = customerService.changePassword(userId, oldPassword, newPassword);

        if (passwordChanged) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid user ID or old password");
        }
    }

}
