package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.dto.CustomerDTO;
import fpoly.datn.ecommerce_website.dto.StaffDTO;
import fpoly.datn.ecommerce_website.dto.StaffDTO1;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IStaffService {

    List<Staffs> findAll();

    Page<Staffs> findAllPage(String search, Integer status, Boolean gender, Role role, Integer page, Integer size);

//    Page<Staffs> findAllSearch(String search, Boolean gender, Integer role, Integer status, Integer page, Integer size);

    Staffs findById(String id);

    Staffs save(StaffDTO1 staffDTO);

    Staffs signup(StaffDTO staffDTO);

    Staffs staffUpdate(Staffs staffs);

    Staffs findByEmail(String mail);

    Staffs update(String staffId, StaffDTO1 staffDTO);

    Staffs updateStatus(String id, Integer status);

    String delete(String id);

    List<Staffs> searchByName(String name);
}
