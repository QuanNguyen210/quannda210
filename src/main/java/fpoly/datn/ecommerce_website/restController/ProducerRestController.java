package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.ProducerDTO;
import fpoly.datn.ecommerce_website.entity.Producers;
import fpoly.datn.ecommerce_website.entity.Sizes;
import fpoly.datn.ecommerce_website.service.ProducerService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api")
@RestController
public class ProducerRestController {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProducerService producerService;

    //GetAll
    @RequestMapping(value = "/producer/", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() {
        List<Producers> sizePage =   this.producerService.findAll();

        List<Producers> filtered = sizePage.stream()
                .filter(color -> color.getProducerStatus() == 1)
                .collect(Collectors.toList());
        return new ResponseEntity<>(

                     filtered
                , HttpStatus.OK);
    }

    //Phan trang
    @RequestMapping(value = "/producer/pagination", method = RequestMethod.GET)
    public ResponseEntity<?> phanTrang(@RequestParam(name = "page", defaultValue = "0") int pageNum,
                                       @RequestParam(name = "size", defaultValue = "15") int pageSize){
        return ResponseEntity.ok(producerService.findAllPagination(pageNum, pageSize));
    }

    //GetOne
    @RequestMapping(value = "/producer", method = RequestMethod.GET)
    public ResponseEntity<ProducerDTO> getOne(@RequestParam String id) {
        return new ResponseEntity<>(
                modelMapper.map(this.producerService.findById(id), ProducerDTO.class)
                , HttpStatus.OK);
    }

    //Add
    @RequestMapping(value = "/producer", method = RequestMethod.POST)
    public ResponseEntity<Producers> save(@Valid @RequestBody ProducerDTO producerDTO) {
        Producers producer = modelMapper.map(producerDTO, Producers.class);
        return new ResponseEntity<>(
                this.producerService.save(producer)
                , HttpStatus.OK);
    }

    //Update
    @RequestMapping(value = "/producer", method = RequestMethod.PUT)
    public ResponseEntity<Producers> update(@Valid @RequestParam String id, @RequestBody ProducerDTO producerDTO) {
        Producers producers = modelMapper.map(producerDTO, Producers.class);
        producers.setProducerId(id);
        return new ResponseEntity<>(
                this.producerService.update(id,producers)
                , HttpStatus.OK);
    }


    @RequestMapping(value = "/producer/update-status", method = RequestMethod.PUT)
    public ResponseEntity<Producers> updateStatus(@Valid @RequestParam String id, @RequestParam int status) {
        return new ResponseEntity<>(producerService.updateStatus(id, status),
                HttpStatus.OK);

    }

    //Delete
    @RequestMapping(value = "/producer", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@RequestParam String id) {
        this.producerService.delete(id);
        return new ResponseEntity<>(
                "Delete Successfuly"
                , HttpStatus.OK);
    }

}
