package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.CustomerDTO;
import fpoly.datn.ecommerce_website.entity.Carts;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Constants;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import fpoly.datn.ecommerce_website.repository.ICartRepository;
import fpoly.datn.ecommerce_website.repository.ICustomerRepository;
import fpoly.datn.ecommerce_website.repository.IUserRepository;
import fpoly.datn.ecommerce_website.service.ICustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ICartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private IUserRepository userInfoRepository;

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
    public Page<Customers> findAllCustomersWithUserInfoUserRole(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return customerRepository.findAllCustomersWithUsersRoles(pageable);
    }

    @Override
    public Page<Customers> findAllSearch(String search, Integer status, Boolean gender, Ranking ranking, Integer page, Integer size, List<String> sortList, String sortOrder) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(createSortOrder(sortList, sortOrder)));
        return customerRepository.findallSearch(search, status, gender, ranking, pageable);
    }


    @Override
    public List<Customers> findAll() {
        return this.customerRepository.findAll();
    }


    @Override
    public Customers findById(String id) {
        return this.customerRepository.findById(id).get();
    }


    @Override
    public Customers save(CustomerDTO customerDTO) {

        Users users = Users.builder()
                .account(customerDTO.getUsers().getAccount())
                .fullName(customerDTO.getUsers().getFullName())
                .password(passwordEncoder.encode(customerDTO.getUsers().getPassword()))
                .email(customerDTO.getUsers().getEmail())
                .userStatus(customerDTO.getUsers().getUserStatus())
                .gender(customerDTO.getUsers().getGender())
                .address(customerDTO.getUsers().getAddress())
                .phoneNumber(customerDTO.getUsers().getPhoneNumber())
                .birthDay(customerDTO.getUsers().getBirthDay())
                .userNote(customerDTO.getUsers().getUserNote())
                .role(customerDTO.getUsers().getRole())
                .build();
        Users savedUserInfo = userInfoRepository.save(users);
        if (savedUserInfo != null) {
            Customers customer = Customers.builder()
                    .consumePoints(0)
                    .customerCode((customerDTO.getCustomerCode()))
                    .customerStatus(customerDTO.getCustomerStatus())
                    .rankingPoints(0)
                    .customerRanking(Ranking.KH_TIEMNANG)
                    .users(savedUserInfo)
                    .build();
            customerRepository.save(customer);
            Carts carts = new Carts();
            carts.setCustomers(customer);
            cartRepository.save(carts);
            return null;
        } else {
            throw new IllegalStateException("Failed to save UserInfo");
        }
    }


    @Override
    public Customers update(CustomerDTO customerDTO) {
        Customers customers = modelMapper.map(customerDTO, Customers.class);
        Users userInfo = modelMapper.map(customerDTO.getUsers(), Users.class);
        userInfo.setRole(customerDTO.getUsers().getRole());
        userInfo.setPassword(passwordEncoder.encode(customerDTO.getUsers().getPassword()));
        Users savedUserInfo = userInfoRepository.save(userInfo);
        if (savedUserInfo != null) {
            customers.setUsers(savedUserInfo);
            return customerRepository.save(customers);
        } else {
            throw new IllegalStateException("Failed to save UserInfo");
        }
    }

    @Override
    public Customers updateNotPassword(CustomerDTO customerDTO) {
        Customers customers = modelMapper.map(customerDTO, Customers.class);
        Users userInfo = modelMapper.map(customerDTO.getUsers(), Users.class);
        userInfo.setRole(customerDTO.getUsers().getRole());
        Users savedUserInfo = userInfoRepository.save(userInfo);
        if (savedUserInfo != null) {
            customers.setUsers(savedUserInfo);
            return customerRepository.save(customers);
        } else {
            throw new IllegalStateException("Failed to save UserInfo");
        }
    }

    public Customers forgetPassword(String customerId, String password) {
        Customers customer = customerRepository.findById(customerId).get();
        customer.getUsers().setPassword(passwordEncoder.encode(password));
        return customerRepository.save(customer);
    }


    @Override
    public Customers updateStatus(String id, Integer status) {
        Customers customer = customerRepository.findById(id).get();
        customer.setCustomerStatus(status);
        return this.customerRepository.save(customer);
    }


    @Override
    public String delete(String id) {

        this.customerRepository.deleteById(id);
        return "Delete successfully";
    }


    @Override
    public List<CustomerDTO> findByKeyword(String keyword) {
        List<Customers> customers = this.customerRepository.findByKeyword(keyword);
        return customers.stream()
                .map(c -> modelMapper.map(c, CustomerDTO.class))
                .toList();
    }

    @Override
    public List<CustomerDTO> findCustomerByKeyword(String keyword) {
        List<Customers> customers = this.customerRepository.findCustomerByKeyword(keyword);
        return customers.stream()
                .map(c -> modelMapper.map(c, CustomerDTO.class))
                .toList();
    }

    @Override
    public Customers findByEmail(String mail) {
        Customers customers = this.customerRepository.findByEmail(mail);

        return customers;
    }

    @Override
    public Customers updateConsumePoint(String customerId, int updateConsumePoint) {
        Customers customers = this.customerRepository.findById(customerId).get();
if(customers.getConsumePoints() > 0){
    customers.setConsumePoints(customers.getConsumePoints() - updateConsumePoint);
}

        this.customerRepository.save(customers);
        return customers;
    }

    @Override
    public CustomerDTO updatePointByTotalPrice(String customerId, Double totalPrice) {
        Customers customers = this.customerRepository.findById(customerId).get();

        int addPoint = (int) (totalPrice / 10000);
        System.out.println("addPoint");
        System.out.println(addPoint);
       customers.setRankingPoints( (addPoint + customers.getRankingPoints()));
       customers.setConsumePoints(addPoint + customers.getConsumePoints());

        if (customers.getRankingPoints() >= Constants.POINTS_TO_UP_KHKC) {
            customers.setCustomerRanking(Ranking.KH_KIMCUONG);
        } else if (customers.getRankingPoints() >= Constants.POINTS_TO_UP_KHV) {
            customers.setCustomerRanking(Ranking.KH_VANG);
        } else if (customers.getRankingPoints() >= Constants.POINTS_TO_UP_KHB) {
            customers.setCustomerRanking(Ranking.KH_BAC);
        } else if (customers.getRankingPoints() >= Constants.POINTS_TO_UP_KHTT) {
            customers.setCustomerRanking(Ranking.KH_THANTHIET);
        } else if (customers.getRankingPoints() >= Constants.POINTS_TO_UP_KHTN) {
            customers.setCustomerRanking(Ranking.KH_TIEMNANG);
        }

        return modelMapper.map(this.customerRepository.save(customers), CustomerDTO.class);
    }

    @Override
    public boolean changePassword(String id, String oldPassword, String newPassword) {
        Customers customers = findById(id);

        if (passwordEncoder.matches(oldPassword, customers.getUsers().getPassword())) {
            customers.getUsers().setPassword(passwordEncoder.encode(newPassword));
            userInfoRepository.save(customers.getUsers());
            return true;
        }

        return false;
    }

}