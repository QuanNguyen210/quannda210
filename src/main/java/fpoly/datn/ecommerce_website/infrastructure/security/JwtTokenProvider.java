package fpoly.datn.ecommerce_website.infrastructure.security;

import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Constants;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    @Value("${secret}")
    private String SECRET;

    public String generateTokenUser(Users users) {
        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.SECOND, Constants.JWTEXPIRATIONINMS);
        Date expiryDate = calendar.getTime();

        String token = Jwts.builder()
                .setSubject(users.getEmail())
                .claim("role", String.valueOf(users.getRole()))
                .claim("name", users.getFullName())
                .claim("address", users.getAddress())
                .claim("idUser", users.getUserId())
                .claim("gender", users.getGender())
                .claim("phoneNumber", users.getPhoneNumber())
                .claim("password", users.getPassword())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, Constants.JWTSECRET)
                .compact();

        return token;
    }
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public String getPasswordFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Constants.JWTSECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
        System.out.println("abc");
        System.out.println(claims);
        String  password = claims.get("password", String.class);
        return (password);
    }
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Constants.JWTSECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
        String email = claims.getSubject();
        String role = claims.get("role", String.class);
        String fullName = claims.get("name", String.class);
        String idUser = claims.get("idUser", String.class);
        String address = claims.get("address", String.class);
        String phoneNumber = claims.get("phoneNumber", String.class);
        Boolean gender = claims.get("gender", Boolean.class);

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
        Users principal = new Users();
        principal.setUserId(String.valueOf(UUID.fromString(idUser)));
        principal.setPhoneNumber(phoneNumber);
        principal.setGender(gender);
        principal.setAddress(address);
        principal.setEmail(email);
        principal.setFullName(fullName);
        principal.setRole(Role.valueOf(authority.getAuthority()));
        return new UsernamePasswordAuthenticationToken(principal, token, Collections.singletonList(authority));
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(Constants.JWTSECRET)
                    .build()
                    .parseClaimsJws(token);
            Date expirationDate = claims.getBody().getExpiration();
            if (expirationDate.before(new Date())) {
                return false;
            }
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
