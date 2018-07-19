FROM php:fpm

RUN apt-get update && apt-get install -y \
        curl \
        wget \
        git


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

WORKDIR /var/www
RUN composer create-project symfony/skeleton it-resume

WORKDIR /var/www/it-resume

# The main purpose of a CMD is to provide defaults for an executing container. These defaults can include an executable,
# or they can omit the executable, in which case you must specify an ENTRYPOINT instruction as well.
CMD ["php-fpm"]
