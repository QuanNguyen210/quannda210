package fpoly.datn.ecommerce_website.restController.auth;

import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.entity.base.ResponseObject;
import fpoly.datn.ecommerce_website.infrastructure.constant.Constants;
import fpoly.datn.ecommerce_website.infrastructure.constant.Message;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import fpoly.datn.ecommerce_website.infrastructure.exception.rest.InvalidTokenException;
import fpoly.datn.ecommerce_website.model.request.CreateUserRequest;
import fpoly.datn.ecommerce_website.model.request.LoginRequest;
import fpoly.datn.ecommerce_website.repository.ICustomerRepository;
import fpoly.datn.ecommerce_website.repository.IStaffRepository;
import fpoly.datn.ecommerce_website.repository.IUserRepository;
import fpoly.datn.ecommerce_website.service.AuthService;
import fpoly.datn.ecommerce_website.service.ICustomerService;
import fpoly.datn.ecommerce_website.service.IStaffService;
import fpoly.datn.ecommerce_website.service.IUserService;
import fpoly.datn.ecommerce_website.service.UserService;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authentication")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private IUserService userService;
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IStaffRepository staffRepository;
    @Autowired
    private ICustomerService customerService;
    @Autowired
    private IStaffService staffService;
    @Autowired
    private ICustomerRepository customerRepository;


    @GetMapping("/getUserToken")
    public ResponseEntity<?> getUserToken(HttpServletRequest request, @RequestParam Role role) {
        String authorizationHeader = request.getHeader("Authorization");

        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            String email = Jwts.parser()
                    .setSigningKey(Constants.JWTSECRET)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            System.out.println("email: " + email);
            if (role.equals(Role.ROLE_CUSTOMER)){
                Customers customers = this.customerService.findByEmail(email);
                return ResponseEntity.ok(customers);
            }
        else{

                Staffs staffs = this.staffRepository.findByEmail(email);
                return ResponseEntity.ok(staffs);
            }


        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getPassword")
    public ResponseEntity<?> getPasswordFromToken(HttpServletRequest request){
        String authorizationHeader = request.getHeader("Authorization");

        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            return new ResponseEntity<>(this.authService.getPasswordFromToken(token), HttpStatus.OK);
        }
        return ResponseEntity.notFound().build();

    }
    @PostMapping("/login-google/{tokenId}")
    public ResponseObject loginGoogle(@PathVariable("tokenId") String tokenId) {
        return new ResponseObject(authService.loginGoogle(tokenId));
    }

    @PostMapping("/login-basic")
    public ResponseObject loginBasic(@RequestBody LoginRequest request) {

        return new ResponseObject(authService.loginBasic(request));
    }

    @PostMapping("/register")
    public ResponseObject register(@RequestBody CreateUserRequest request) {
        return new ResponseObject(userService.create(request));
    }

    @GetMapping("/logout")
    public String logout() {
        return "Logout";
    }

    @GetMapping("/validateToken")
    public Boolean validateToken(@RequestParam String token) {
        Boolean valid = authService.validateToken(token);
        return valid;
    }

}
