FROM php:7.4-apache

WORKDIR /var/www/html
COPY ./app .

# Config permission
RUN chown -R root:www-data /var/www/html
RUN chmod 750 /var/www/html
RUN find . -type f -exec chmod 640 {} \;
RUN find . -type d -exec chmod 750 {} \;
RUN chmod +t -R /var/www/html/

# Enale rewrite mode for Apache
RUN a2enmod rewrite
RUN service apache2 restart

RUN echo "HPT{PHP_TypE_JuGglinG}MinKhoy" > /DAY_LA_CAI_FLAG_CHUC_MUNG_BAN.txt
