package fpoly.datn.ecommerce_website.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Setter
@Getter

public class CartDetailId implements Serializable {
    private String productDettailId;
    private String cartId;
}
