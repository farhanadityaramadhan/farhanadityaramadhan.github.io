library(tidyverse)
library(haven)

tax_data <- read_dta("data/public/govrev/UNUWIDERGRD_2025.dta") %>% 
  select(identifier, country, iso, id, reg, year, inc,
         rev_ex_sc, rev_ex_gr_ex_sc,
         tax_ex_sc, nontax, nrtax_ex_sc, resourcetaxes,
         direct_ex_sc_ex_rt, nr_indirect,res_nontax, nr_nontax,
         sc, grants) %>% 
  mutate()
  
