FROM public.ecr.aws/lambda/ruby:2.7
ARG RAILS_ENV
ENV RAILS_ENV=$RAILS_ENV
RUN ln -s /bin/hostid /bin/hostname
COPY . .

CMD ["app.handler"]
