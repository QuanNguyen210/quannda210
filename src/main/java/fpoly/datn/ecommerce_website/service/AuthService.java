package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.model.request.LoginRequest;
import fpoly.datn.ecommerce_website.model.response.JwtResponse;
import jakarta.validation.Valid;

public interface AuthService {

    JwtResponse loginGoogle(String tokenId);

    JwtResponse loginBasic(@Valid LoginRequest request);


    String getPasswordFromToken(String token);

    Boolean validateToken(String jwtToken);
}
