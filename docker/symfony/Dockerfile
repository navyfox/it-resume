FROM php:7.1-fpm

RUN apt-get update && apt-get install -y \
        curl \
        wget \
        git \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        sudo \
    && docker-php-ext-install -j$(nproc) iconv mcrypt mbstring mysqli pdo_mysql zip \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd

RUN usermod -u 1000 www-data

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN wget -O drush.phar https://github.com/drush-ops/drush-launcher/releases/download/0.6.0/drush.phar \
    && mv drush.phar /usr/local/bin/drush


ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

WORKDIR /var/www
RUN composer create-project symfony/skeleton it-resume

WORKDIR /var/www/it-resume
RUN composer require form validator twig-bundle orm-pack security-csrf \
    && composer require annotations \
    && composer require symfony/maker-bundle --dev


WORKDIR /var/www/it-resume

# The main purpose of a CMD is to provide defaults for an executing container. These defaults can include an executable,
# or they can omit the executable, in which case you must specify an ENTRYPOINT instruction as well.
CMD ["php-fpm"]
