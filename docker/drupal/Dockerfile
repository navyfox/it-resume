FROM drupal:fpm

RUN apt-get update && apt-get install -y \
        curl \
        wget \
        git \
        nano \
        sudo

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

RUN composer require drush/drush
