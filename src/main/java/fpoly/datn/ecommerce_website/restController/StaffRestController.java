package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.StaffDTO;
import fpoly.datn.ecommerce_website.dto.StaffDTO1;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import fpoly.datn.ecommerce_website.repository.IStaffRepository;
import fpoly.datn.ecommerce_website.repository.IUserRepository;
import fpoly.datn.ecommerce_website.service.serviceImpl.CustomerServiceImpl;
import fpoly.datn.ecommerce_website.service.serviceImpl.StaffServiceImpl;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class StaffRestController {

    @Autowired
    private CustomerServiceImpl customerService;
    @Autowired
    private StaffServiceImpl staffService;
    @Autowired
    private IStaffRepository staffRepository;
    @Autowired
    private IUserRepository userInfoRepository;
    @Autowired
    private ModelMapper modelMapper;

    @RequestMapping("/staff/get-all")
    public ResponseEntity<List<StaffDTO1>> getAll() {
        List<Staffs> list = staffService.findAll();
        System.out.println(list.size());
        return new ResponseEntity<>(
                list.stream().map(staff -> modelMapper.map(staff, StaffDTO1.class))
                        .collect(Collectors.toList()),
                HttpStatus.OK);
    }

    // GetAllPage
    @RequestMapping(value = "/staff/pagination", method = RequestMethod.GET)
    public ResponseEntity<?> getAll(
            @RequestParam(name = "search", defaultValue = "") String search,
            @RequestParam(name = "page", defaultValue = "0") int pageNum,
            @RequestParam(name = "size", defaultValue = "10") int pageSize,
            @RequestParam(name = "status", required = false) Integer status,
            @RequestParam(name = "gender", required = false) Boolean gender,
            @RequestParam(name = "role", required = false) String role
    ) {
        if(role.equalsIgnoreCase("ROLE_ADMIN")){
            Page<Staffs> staffPage = staffService.findAllPage(search, status, gender, Role.ROLE_ADMIN, pageNum, pageSize);
            return new ResponseEntity<>(staffPage, HttpStatus.OK);
        }else if(role.equalsIgnoreCase("ROLE_STAFF")){
            Page<Staffs> staffPage = staffService.findAllPage(search, status, gender, Role.ROLE_STAFF, pageNum, pageSize);
            return new ResponseEntity<>(staffPage, HttpStatus.OK);
        }else{
            Page<Staffs> staffPage = staffService.findAllPage(search, status, gender, null, pageNum, pageSize);
            return new ResponseEntity<>(staffPage, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/staff", method = RequestMethod.GET)
    public ResponseEntity<StaffDTO> getOne(@RequestParam("id") String id) {
        Staffs staff = staffService.findById(id);
        if (staff == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        StaffDTO staffDTO = modelMapper.map(staff, StaffDTO.class);
        Users userInfo = staff.getUsers();
        return new ResponseEntity<>(staffDTO, HttpStatus.OK);
    }
    @RequestMapping(value = "/staff/findByUserId", method = RequestMethod.GET)
    public ResponseEntity<?> findByUserId(@RequestParam("userId") String userId) {
        return new ResponseEntity<>(
                this.staffRepository.findByUsersId(userId)
                , HttpStatus.OK
        );

    }
    @RequestMapping(value = "/staff", method = RequestMethod.POST)
    public ResponseEntity<Staffs> add(@RequestBody StaffDTO1 staffDTO) {
        return new ResponseEntity<>(this.staffService.save(staffDTO), HttpStatus.OK);
    }
    @RequestMapping(value = "/staff/signup", method = RequestMethod.POST)
    public ResponseEntity<Staffs> save(@RequestBody StaffDTO staffDTO) {
        return new ResponseEntity<>(this.staffService.signup(staffDTO), HttpStatus.OK);
    }

    @RequestMapping(value = "/staff", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@Valid @RequestParam String id, @RequestBody StaffDTO1 staffDTO) {
        return new ResponseEntity<>(staffService.update(id, staffDTO),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/staff/update", method = RequestMethod.PUT)
    public ResponseEntity<?> staffUpdate(@Valid  @RequestBody Staffs staff) {
        return new ResponseEntity<>(staffService.staffUpdate(staff),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/staff/forget-password", method = RequestMethod.PUT)
    public ResponseEntity<?> forgetPassword(
            @RequestParam(name = "staffId") String staffId,
            @RequestParam(name = "password") String password
    ) {
        return new ResponseEntity<>
                (staffService.forgetPassword(staffId, password), HttpStatus.OK);

    }

    // updateStatus
    @RequestMapping(value = "/staff/update-status", method = RequestMethod.PUT)
    public ResponseEntity<Staffs> updateStatus(@Valid @RequestParam String id, @RequestParam int status) {
        return new ResponseEntity<>(staffService.updateStatus(id, status),
                HttpStatus.OK);

    }

    @RequestMapping(value = "/staff", method = RequestMethod.DELETE)
    public ResponseEntity<String> delete(@RequestParam String id) {
        this.staffService.delete(id);
        return new ResponseEntity<>("Delete Successfully", HttpStatus.OK);
    }

    @RequestMapping(value = "/staff/findByEmail", method = RequestMethod.GET)
    public ResponseEntity<?> findCustomerByEmail(
            @RequestParam(name = "email") String email
    ) {
        return new ResponseEntity<>
                (this.staffRepository.findByEmail(email), HttpStatus.OK);
    }

    @RequestMapping(value = "/staff/findByPhoneNumber", method = RequestMethod.GET)
    public ResponseEntity<?> findByPhoneNumber(
            @RequestParam(name = "phoneNumber") String phoneNumber
    ) {
        Staffs customers = this.staffRepository.findByPhoneNumber(phoneNumber);
        return new ResponseEntity<>
                (customers, HttpStatus.OK);
    }

//    @RequestMapping(value = "/staff/getAllPagination", method = RequestMethod.GET)
//    public ResponseEntity<?> getAllSearch(
//            @RequestParam(name = "page", defaultValue = "0") int pageNum,
//            @RequestParam(name = "size", defaultValue = "10") int pageSize,
//            @RequestParam(name = "search", defaultValue = "") String search,
//            @RequestParam(name = "gender", required = false) Boolean gender,
//            @RequestParam(name = "role", required = false) Integer role,
//            @RequestParam(name = "status", required = false) Integer status) {
//        Page<Staffs> staffSearch = staffService.findAllSearch(search, gender, role, status, pageNum, pageSize);
//        return new ResponseEntity<>(staffSearch, HttpStatus.OK);
//    }

}
