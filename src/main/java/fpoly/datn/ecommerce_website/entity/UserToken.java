package fpoly.datn.ecommerce_website.entity;

import fpoly.datn.ecommerce_website.infrastructure.constant.EntityProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Setter
@Table(name = "usertoken")
public class UserToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "token", length = EntityProperties.LENGTH_TOKEN)
    private String token;

    @Column(name = "expiredat")
    private Long expiredAt;

    @Column(name = "userid")
    private UUID userId;
}
