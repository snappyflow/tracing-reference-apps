// you can use it as
// logger.WithFields(logrusCtxLabel.contextMap).Info("msg")

package main

import (
	"context"
	"fmt"
	"os"

	_ "github.com/snappyflow/go-sf-apm-lib"

	"github.com/sirupsen/logrus"
	easy "github.com/t-tomalak/logrus-easy-formatter"
	"go.elastic.co/apm/module/apmlogrus/v2"
	"go.elastic.co/apm/v2"
)

const (
	logrusFilePath   = "/var/log/trace/goji.log"
	logrusTimeFormat = "02/Jan/2006 15:04:05"
	logrusFormat     = "[%time%] [%lvl%] [%msg%] | elasticapm transaction.id=%transaction.id% trace.id=%trace.id% span.id=%span.id%\n"
)

var logger = &logrus.Logger{}

// LogFormatter is the custom logrus formatter
type LogFormatter struct {
	logrus.Formatter
}

// LogrusCtxLabels stores current transaction IDs
type LogrusCtxLabels struct {
	contextMap map[string]interface{}
	curCtx     context.Context
}

var logrusCtxLabel = &LogrusCtxLabels{
	curCtx:     nil,
	contextMap: make(map[string]interface{}),
}

// NewLogrusWriter opens the log file
func NewLogrusWriter(filePath string) *os.File {
	file, _ := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	return file
}

// Format formats the time in UTC zone
func (lf LogFormatter) Format(e *logrus.Entry) ([]byte, error) {
	e.Time = e.Time.UTC()
	return lf.Formatter.Format(e)
}

// UpdateCtxLabels updates the context labels with the latest values
func (c *LogrusCtxLabels) UpdateCtxLabels(ctx context.Context) {
	c.curCtx = ctx
	traceContextFields := apmlogrus.TraceContext(c.curCtx)
	c.contextMap["transaction.id"] = traceContextFields["transaction.id"].(apm.SpanID).String()
	c.contextMap["trace.id"] = traceContextFields["trace.id"].(apm.TraceID).String()
	if _, ok := traceContextFields["span.id"]; ok {
		c.contextMap["span.id"] = traceContextFields["span.id"].(apm.SpanID).String()
	} else {
		c.contextMap["span.id"] = "None"
	}
}

func init() {
	logger.Out = NewLogrusWriter(logrusFilePath)
	logger.Level = logrus.DebugLevel
	logger.SetFormatter(LogFormatter{&easy.Formatter{
		TimestampFormat: logrusTimeFormat,
		LogFormat:       logrusFormat,
	}})
}
