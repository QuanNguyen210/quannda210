package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.StaffDTO;
import fpoly.datn.ecommerce_website.dto.StaffDTO1;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import fpoly.datn.ecommerce_website.repository.IStaffRepository;
import fpoly.datn.ecommerce_website.repository.IUserRepository;
import fpoly.datn.ecommerce_website.service.IStaffService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffServiceImpl implements IStaffService {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IStaffRepository staffRepository;
    @Autowired
    private IUserRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

   
    @Override
    public List<Staffs> findAll() {
        return this.staffRepository.findAll();
    }

    @Override
    public Page<Staffs> findAllPage(String search, Integer status, Boolean gender, Role role, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return staffRepository.getAllPage(search, status, gender, role, pageable);
    }

//    @Override
//    public Page<Staffs> findAllSearch(String search, Boolean gender, Integer role, Integer status, Integer page, Integer size){
//        Pageable pageable = PageRequest.of(page, size);
//        return staffRepository.findallSearch(search, gender, role, status, pageable);
//    }



    @Override
    public Staffs findById(String id) {
        Optional<Staffs> optional = staffRepository.findById(id);
        return optional.get();
    }


    @Override
    public Staffs save(StaffDTO1 staffDTO) {
        Staffs staff = modelMapper.map(staffDTO, Staffs.class);
        staff.setStaffStatus(staffDTO.getStaffStatus());
        Users userInfo = modelMapper.map(staffDTO, Users.class);
        userInfo.setRole(staffDTO.getUsersRolesRoleName());
        userInfo.setPassword(passwordEncoder.encode(staffDTO.getUsersPassword()));
        Users savedUserInfo = userInfoRepository.save(userInfo);
        if (savedUserInfo != null) {
            staff.setUsers(savedUserInfo);
            return staffRepository.save(staff);
        } else {
            throw new IllegalStateException("Failed to save UserInfo");
        }
    }
    @Override
    public Staffs signup(StaffDTO staffDTO) {
        Staffs staff = modelMapper.map(staffDTO, Staffs.class);

        if (staff != null) {
            staff.getUsers().setPassword(passwordEncoder.encode(staffDTO.getUsers().getPassword()));
            return staffRepository.save(staff);
        } else {
            throw new IllegalStateException("Failed to save UserInfo");
        }
    }
    @Override
    public Staffs staffUpdate(Staffs staffs) {
        if (staffs != null) {
            return staffRepository.save(staffs);
        } else {
            throw new IllegalStateException("Failed to save UserInfo");
        }
    }

    public Staffs forgetPassword(String staffId, String password) {
        Staffs staffs = staffRepository.findById(staffId).get();
        staffs.getUsers().setPassword(passwordEncoder.encode(password));
        return staffRepository.save(staffs);
    }


    @Override
    public Staffs findByEmail(String mail) {
        Staffs customers = this.staffRepository.findByEmail(mail);

        return customers;
    }

    @Override
    public Staffs update(String staffId, StaffDTO1 staffDTO) {
        Staffs staffs = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        modelMapper.map(staffDTO, Staffs.class);
        Users userInfo = userInfoRepository.findById(staffDTO.getUsersId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        modelMapper.map(staffDTO, Users.class);
        userInfo.setAccount(staffDTO.getUsersAccount());
        userInfo.setFullName(staffDTO.getUsersFullName());
        userInfo.setAddress(staffDTO.getUsersAddress());
        userInfo.setEmail(staffDTO.getUsersEmail());
        userInfo.setPhoneNumber(staffDTO.getUsersPhoneNumber());
        userInfo.setRole(staffDTO.getUsersRolesRoleName());
        userInfo.setGender(staffDTO.getUsersGender());
        userInfo.setAccount(staffDTO.getUsersAccount());
        userInfo.setUserNote(staffDTO.getUsersUserNote());
        Users savedUserInfo = userInfoRepository.save(userInfo);
        if (savedUserInfo != null) {
            staffs.setStaffStatus(staffDTO.getStaffStatus());

            return staffRepository.save(staffs);
        } else {
            throw new IllegalStateException("Failed to save UserInfo");

        }

    }

    @Override
    public Staffs updateStatus(String id, Integer status){
        Staffs staff = staffRepository.findById(id).get();
        staff.setStaffStatus(status);
        return staffRepository.save(staff);
    }
    
    @Override
    public String delete(String id) {

        this.staffRepository.deleteById(id);
        return "Delete successfully";
    }

    
    @Override
    public List<Staffs> searchByName(String name) {
        return null;
    }
}
