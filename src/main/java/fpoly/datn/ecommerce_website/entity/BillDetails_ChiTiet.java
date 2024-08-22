package fpoly.datn.ecommerce_website.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Setter
@Getter
@Table(name = "bill_details", schema = "dbo", catalog = "FashionBagsEcommerceDB")
public class BillDetails_ChiTiet {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @Column(name = "bill_detail_id")
    private String billDetailId;
    @ManyToOne
    @JoinColumn(name = "bill_id", referencedColumnName = "bill_id")
    private Bills bills;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_detail_id", referencedColumnName = "product_detail_id")
    private ProductDetails productDetails;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "price")
    private Double price;

    @Column(name = "bill_detail_status")
    private Integer billDetailStatus;

    @Column(name = "bill_detail_note")
    private String billDetailNote;
}
