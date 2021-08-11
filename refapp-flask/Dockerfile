FROM python:3.8-slim-buster

USER root

RUN mkdir /app

COPY ./app.py /app

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN mkdir -p /var/log/trace
RUN touch /var/log/trace/flask.log

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]