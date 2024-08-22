package fpoly.datn.ecommerce_website.restController;


import fpoly.datn.ecommerce_website.dto.UserDTO;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.repository.IUserRepository;
import fpoly.datn.ecommerce_website.service.serviceImpl.UserServiceImpl;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController


@RequestMapping("/api")

public class UserRestController {

    @Autowired
    public IUserRepository iUserInfoRepository;
    @Autowired
    public UserServiceImpl userInfoService;
    @Autowired
    private ModelMapper modelMapper;

    List<Users> list = new ArrayList<>();


    @GetMapping("/user")
    public List<Users> getAll() {
        this.userInfoService.findAll();
        list = iUserInfoRepository.findAll();
        return list;
    }

    //Phan trang
    @RequestMapping(value = "/user/phanTrang", method = RequestMethod.GET)
    public ResponseEntity<?> phanTrang(@RequestParam(name = "page", defaultValue = "0") int pageNum,
                                       @RequestParam(name = "size", defaultValue = "10") int pageSize){
        return ResponseEntity.ok(userInfoService.findAllPhanTrang(pageNum, pageSize));
    }


    //getone
    @RequestMapping("/user")
    public ResponseEntity<UserDTO> getOne(@RequestParam("id") String id) {
        Users userInfo = iUserInfoRepository.findById(id).get();
        if(userInfo == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        UserDTO userInfoDTO = modelMapper.map(userInfo, UserDTO.class);

        return new ResponseEntity<>(userInfoDTO, HttpStatus.OK);
    }

    //add
    @RequestMapping(value = "/user", method = RequestMethod.POST)
    public ResponseEntity<Users> add(@RequestBody UserDTO userInfoDTO) {
        Users x = modelMapper.map(userInfoDTO, Users.class);
        return new ResponseEntity<>(this.userInfoService.save(x), HttpStatus.OK);
    }
//    @PostMapping("")
//    public Users add(@RequestBody Users userInfo) {
//        iUserInfoRepository.save(userInfo);
//        return userInfo;
//    }
//
//    @GetMapping("/{id}")
//    public Users getOne(@PathVariable("userId") String id) {
//        Users userInfo = iUserInfoRepository.findById(id).get();
//        return userInfo;
//    }
    
    
    @RequestMapping(value = "/user/search", method = RequestMethod.GET)
    public ResponseEntity<?> findCustomerByKeyword(@RequestParam String keyword) {
        return new ResponseEntity<>(
                this.userInfoService.findCustomerByKeyword(keyword) .stream()
                        .map(userInfo -> modelMapper.map(userInfo, UserDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK);
    }
}
